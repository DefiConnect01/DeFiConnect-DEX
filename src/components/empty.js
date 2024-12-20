import React, { useContext, useState, useCallback, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowUpDownLine } from "react-icons/ri";
import { AppDataContext } from "../context/appContext";
import { parseEther, formatUnits } from "viem";
import {
    useWriteContract,
    useAccount,
    useWaitForTransactionReceipt,
    useReadContract,
    useSwitchChain,
    useBalance
} from "wagmi";
import { abi, baseSepoliaAddress, cybriaAddress } from "../constants";
import { toast } from 'react-toastify';
import CYBALogo from "../assets/cyba.svg"
import CYBALogoDark from "../assets/cyba_dark.svg"

const CHAIN_IDS = {
    CYBRIA: 6666,
    BASE_SEPOLIA: 84532,
};

const TOKENS = {
    CYBRIA: {
        CYBA: "0x2cb527E7EebF5A679dda71e859c2A1aBceA800cb",
        USDT: "0x102bd5D18b2f6800ef4dcaF5fCe131fbb52aeBA4",
    },
    BASE_SEPOLIA: {
        CYBA: "0x2520789fbfD257d3782137660675E96D695F2eAd",
        USDT: "0xd1e728572AD0F0Bd8AD9EEf614C353CdE527929B",
    },
};

const TransactionInterface = () => {
    const { setSelectTokenModal, isDarkMode } = useOutletContext();
    const { fromChain, setFromChain, selectedToken } = useContext(AppDataContext);

    const [txHash, setTxHash] = useState(null);
    const [approvalTxHash, setApprovalTxHash] = useState(null);
    const [transactionState, setTransactionState] = useState("idle");
    const [approvalState, setApprovalState] = useState("idle");
    const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
    const [needsApproval, setNeedsApproval] = useState(true);
    const [needChainSwitch, setNeedChainSwitch] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error - Try Again");
    const [amount, setAmount] = useState("");
    const [cybaPrice, setCybaPrice] = useState();
    const [fee, setFee] = useState(null);
    const [isFetchingFee, setIsFetchingFee] = useState(false);

    const { switchChain } = useSwitchChain();
    const { address, chain } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // Balance queries
    const { data: fromBalanceData } = useBalance({
        address,
        token: fromChain === "CYBRIA" && selectedToken === "CYBA" ? null : TOKENS[fromChain][selectedToken]
    });

    const { data: toTokenBalanceData } = useBalance({
        address,
        chainId: fromChain === "CYBRIA" ? 84532 : 6666,
        token: fromChain === "BASE_SEPOLIA" && selectedToken === "CYBA" ? null : fromChain === "CYBRIA" ? TOKENS["BASE_SEPOLIA"][selectedToken] : TOKENS["CYBRIA"][selectedToken]
    });

    const fromTokenDecimals = fromBalanceData?.decimals || 18;
    const toTokenDecimals = toTokenBalanceData?.decimals || 18;

    const formattedFromBalance = fromBalanceData
        ? Number(formatUnits(fromBalanceData.value, fromTokenDecimals)).toFixed(2)
        : "0";

    const formattedToBalance = toTokenBalanceData
        ? Number(formatUnits(toTokenBalanceData.value, toTokenDecimals)).toFixed(2)
        : "0";

    // Transaction receipt hooks
    const {
        isLoading,
        isSuccess: isConfirmed,
        isError,
    } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const {
        isLoading: approvalTxIsLoading,
        isSuccess: approvalTxIsConfirmed,
        isError: approvalIsTxError,
    } = useWaitForTransactionReceipt({
        hash: approvalTxHash,
    });

    // Contract reads
    const { data: allowance } = useReadContract({
        address: TOKENS[fromChain][selectedToken],
        abi: [
            {
                constant: true,
                inputs: [
                    { name: "_owner", type: "address" },
                    { name: "_spender", type: "address" },
                ],
                name: "allowance",
                outputs: [{ name: "", type: "uint256" }],
                type: "function",
            },
        ],
        functionName: "allowance",
        args: [
            address,
            fromChain === "CYBRIA" ? cybriaAddress : baseSepoliaAddress,
        ],
    });

    const { data: feeData, refetch: refetchFee } = useReadContract({
        address: fromChain === "CYBRIA" ? cybriaAddress : baseSepoliaAddress,
        abi,
        functionName: "getCalculatedFee",
        enabled: false, // Don't automatically fetch
    });

    // Fee and price fetching function
    const fetchFeeAndPrice = async () => {
        try {
            setIsFetchingFee(true);

            const fromChainId = fromChain === "CYBRIA" ? CHAIN_IDS.CYBRIA : CHAIN_IDS.BASE_SEPOLIA;

            // Make the price check request
            const response = await fetch('https://intermediate-violette-aremson-660931f7.koyeb.app/api/price', {
                method: 'POST',
                headers: {
                    'cyber-api-key': 'a81f1659-19f1-4552-bb6d-b639852f8914',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ network: fromChainId })
            });

            if (!response.ok) {
                throw new Error(`Price check HTTP error! status: ${response.status}`);
            }

            // After successful price check, fetch the new fee
            const { data: newFee } = await refetchFee();

            if (!newFee) {
                throw new Error('Failed to fetch new fee');
            }

            setFee(newFee);
            return newFee;

        } catch (error) {
            // console.error('Error in fee and price fetching:', error);
            throw error;
        } finally {
            setIsFetchingFee(false);
        }
    };

    useEffect(() => {
        const getCoinPrice = async (amount = 1) => {
            try {
                const response = await fetch(
                    `https://min-api.cryptocompare.com/data/price?fsym=CYBA&tsyms=USD&api_key=${import.meta.env.VITE_PRICE_API_KEY}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                const price = result?.USD * amount;
                setCybaPrice(price);
            } catch (error) {
                // console.error('Error fetching coin price:', error);
            }
        };

        getCoinPrice();
    }, []);

    useEffect(() => {
        const currentChain = chain?.name;
        const isCybriaMismatch = fromChain === "CYBRIA" && currentChain !== "Cybria Testnet";
        const isBaseSepoliaMismatch = fromChain === "BASE_SEPOLIA" && currentChain !== "Base Sepolia";

        setNeedChainSwitch(isCybriaMismatch || isBaseSepoliaMismatch);
    }, [chain, fromChain]);

    useEffect(() => {
        if (fromChain === "CYBRIA" && selectedToken === "CYBA") {
            setNeedsApproval(false);
            return;
        }

        if (!amount || !allowance) {
            setNeedsApproval(true);
            return;
        }

        try {
            const parsedAmount = parseEther(amount.toString());
            setNeedsApproval(allowance < parsedAmount);
        } catch (err) {
            // console.error("Error parsing amount:", err);
            setNeedsApproval(true);
        }
    }, [allowance, amount, fromChain, selectedToken]);

    useEffect(() => {
        if (isLoading) setTransactionState("confirming");
        else if (isConfirmed) {
            setTransactionState("confirmed");
            toast.success('🎉 Transaction successful!');
            setIsTransactionCompleted(true);
        } else if (isError) {
            setTransactionState("error");
        }
    }, [isLoading, isConfirmed, isError]);

    useEffect(() => {
        if (approvalTxIsLoading) setApprovalState("confirming");
        else if (approvalTxIsConfirmed) {
            setApprovalState("approved");
            setNeedsApproval(false);
        } else if (approvalIsTxError) {
            setApprovalState("error");
        }
    }, [approvalTxIsLoading, approvalTxIsConfirmed, approvalIsTxError]);

    const handleSwitchChains = () => {
        const nextChainId = CHAIN_IDS[fromChain];
        switchChain({ chainId: nextChainId });
    };

    const handleApprove = useCallback(async () => {
        if (!writeContractAsync || !amount) return;

        try {
            setApprovalState("approving");

            const tokenAddress = TOKENS[fromChain][selectedToken];
            const spenderAddress = fromChain === "CYBRIA" ? cybriaAddress : baseSepoliaAddress;
            const parsedAmount = parseEther(amount.toString());

            const hash = await writeContractAsync({
                address: tokenAddress,
                abi: [
                    {
                        constant: false,
                        inputs: [
                            { name: "_spender", type: "address" },
                            { name: "_value", type: "uint256" },
                        ],
                        name: "approve",
                        outputs: [{ name: "", type: "bool" }],
                        type: "function",
                    },
                ],
                functionName: "approve",
                args: [spenderAddress, parsedAmount],
            });

            setApprovalTxHash(hash);
            setApprovalState("approved");
        } catch (err) {
            // console.error("Failed to approve:", err);
            setApprovalState("error");
        }
    }, [writeContractAsync, fromChain, selectedToken, amount]);

    const handleSend = useCallback(async () => {
        if (!writeContractAsync || !amount) return;

        try {
            setTransactionState("sending");

            // Fetch fee before proceeding with transaction
            const currentFee = await fetchFeeAndPrice();

            const isCybria = fromChain === "CYBRIA";
            const dstChainId = isCybria ? CHAIN_IDS.BASE_SEPOLIA : CHAIN_IDS.CYBRIA;

            const srcToken = TOKENS[fromChain][selectedToken];
            const dstToken = TOKENS[isCybria ? "BASE_SEPOLIA" : "CYBRIA"][selectedToken];

            const userInput = parseEther(amount.toString());
            const nativeUserInput = parseEther(amount.toString()) + currentFee;

            const nativeValue = nativeUserInput;
            const othersValue = currentFee;

            const contractAddress = isCybria ? cybriaAddress : baseSepoliaAddress;
            const functionName = isCybria && selectedToken === "CYBA" ? "sendNative" : "send";

            const args = isCybria && selectedToken === "CYBA"
                ? [address, dstToken, nativeUserInput, dstChainId, 0n, 5000]
                : [address, srcToken, dstToken, userInput, dstChainId, 1n, 10];

            const value = isCybria && selectedToken === "CYBA"
                ? nativeValue
                : othersValue;

            const hash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName,
                args,
                value,
            });

            setTxHash(hash);
            setTransactionState("confirming");
        } catch (err) {
            handleTransactionError(err);
        }
    }, [writeContractAsync, fromChain, selectedToken, amount, address]);

    const handleTransactionError = (err) => {
        const message = err.message;
        if (message.includes("transfer exist")) {
            setErrorMessage("Transfer already exists. Change amount.");
        } else if (message.includes("InsufficientFunds")) {
            setErrorMessage("Insufficient Funds");
        } else {
            setErrorMessage("Failed to send transaction");
        }
        console.error("Failed to send transaction:", err.message);
        setTransactionState("error");
    };

    const getButtonText = () => {
        if (isTransactionCompleted) {
            return "Transaction Confirmed!";
        }

        if (needChainSwitch) {
            return "Switch Chains";
        }

        if (isFetchingFee) {
            return "Calculating Fee...";
        }

        if (!needsApproval) {
            const texts = {
                idle: "Transfer",
                sending: "Sending...",
                confirming: "Confirming...",
                confirmed: "Transaction Confirmed!",
                error: "Error - Try Again",
            };
            return texts[transactionState] || texts.idle;
        } else {
            const texts = {
                idle: "Approve",
                approving: "Approving...",
                confirming: "Confirming Approval...",
                approved: "Approved! Click to Transfer",
                error: "Approval Error - Try Again",
            };
            return texts[approvalState] || texts.idle;
        }
    };

    const isButtonDisabled =
        ["sending", "confirming", "approving"].includes(transactionState) ||
        ["approving", "confirming"].includes(approvalState) ||
        !amount ||
        isFetchingFee;

    const handleButtonClick = () => {
        if (isTransactionCompleted) {
            resetTransaction();
            return;
        }
        if (needChainSwitch) {
            handleSwitchChains();
            return;
        }

        if (!needsApproval) {
            hand