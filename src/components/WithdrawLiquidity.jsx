import React, { useContext, useState, useCallback, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowUpDownLine } from "react-icons/ri";
import { AppDataContext } from "../context/appContext";
import { parseEther, formatUnits, parseUnits } from "viem";
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
  useSwitchChain,
  useBalance
} from "wagmi";
import { abi, baseSepoliaAddress,ethereumAddress, cybriaAddress } from "../constants";
import { toast } from 'react-toastify';
import CYBALogo from "../assets/cyba.svg"
import CYBALogoDark from "../assets/cyba_dark.svg"
import TransactionMenu from "./TransactionMenu";

const priceUpdateLink = import.meta.env.VITE_PRICE_UPDATE_LINK
const cyberApiKey = import.meta.env.VITE_CYBER_API_KEY


const CHAIN_IDS = {
  CYBRIA: 6661,
  BASE_SEPOLIA: 84532,
  ETHEREUM: 1
};

const TOKENS = {
  CYBRIA: {
    CYBA: "0x95622Fce49d65D1101f6FDa8b6325459A6188E52",
    // USDT: "0x102bd5D18b2f6800ef4dcaF5fCe131fbb52aeBA4",
  },
  BASE_SEPOLIA: {
    CYBA: "0xE5a4574B92A3D9528CFE9FC1a02F4983dBFd8aa1",
    // USDT: "0xd1e728572AD0F0Bd8AD9EEf614C353CdE527929B",
  }, ETHEREUM:{
    CYBA: "0x1063181dc986F76F7eA2Dd109e16fc596d0f522A"
  }
};

const WithdrawLiquidity = () => {
  const { setSelectTokenModal, isDarkMode } = useOutletContext();
  const { fromChain, setFromChain, selectedToken } = useContext(AppDataContext);

  const [option, setOption] = useState("Unstake");
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
    chainId: fromChain === "CYBRIA" ? 1 : 6661,
    token: fromChain === "ETHEREUM" && selectedToken === "CYBA" ? null : fromChain === "CYBRIA" ? TOKENS["ETHEREUM"][selectedToken] : TOKENS["CYBRIA"][selectedToken]
  });
// console.log("from:",fromBalanceData,"to:", toTokenBalanceData)
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
      fromChain === "CYBRIA" ? cybriaAddress : ethereumAddress,
    ],
  });

  const { data: feeData, refetch: refetchFee } = useReadContract({
    address: fromChain === "CYBRIA" ? cybriaAddress : ethereumAddress,
    abi,
    functionName: "getCalculatedFee",
    enabled: false, // Don't automatically fetch
  });

  // Then wrap fetchFeeAndPrice in useCallback to prevent infinite loop
  const fetchFeeAndPrice = useCallback(async () => {
    try {
      setIsFetchingFee(true);

      const fromChainId = fromChain === "CYBRIA" ? CHAIN_IDS.CYBRIA : CHAIN_IDS.ETHEREUM;

      const response = await fetch(priceUpdateLink, {
        method: 'POST',
        headers: {
          'cyber-api-key': cyberApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ network: fromChainId })
      });

      if (!response.ok) {
        throw new Error(`Price check HTTP error! status: ${response.status}`);
      }
// console.log("fee fetched")
      const { data: newFee } = await refetchFee();

      if (!newFee) {
        throw new Error('Failed to fetch new fee');
      }

      setFee(newFee);
      // console.log("newfeeeeeeeeeeeeeeeeeeee:",newFee)
      return newFee;

    } catch (error) {
      // console.error('Error in fee and price fetching:', error);
      throw error;
    } finally {
      setIsFetchingFee(false);
    }
  }, [fromChain, refetchFee]); // Add dependencies

  // Add detailed debug logging
  // useEffect(() => {
  //   console.log('Button State Debug:', {
  //     transactionState,
  //     approvalState,
  //     amount,
  //     fromChain,
  //     selectedToken,
  //     fee,
  //     isFetchingFee,
  //     needsApproval,
  //     isTransactionCompleted,
  //     needChainSwitch
  //   });
  // }, [transactionState, approvalState, amount, fromChain, selectedToken, fee, isFetchingFee, needsApproval, isTransactionCompleted, needChainSwitch]);
 
  // Update the fee fetching useEffect to include all required dependencies
  useEffect(() => {
    const fetchFeeIfNeeded = async () => {
      if (amount && fromChain === "CYBRIA" && selectedToken === "CYBA") {
        try {
          await fetchFeeAndPrice();
        } catch (error) {
          // console.error('Error fetching fee:', error);
        }
      }
    };

    fetchFeeIfNeeded();
  }, [amount, fromChain, selectedToken, fetchFeeAndPrice]); // Add fetchFeeAndPrice to dependencies

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
    const isCybriaMismatch = fromChain === "CYBRIA" && currentChain !== "Cybria";
    const isEthereumMismatch = fromChain === "ETHEREUM" && currentChain !== "Ethereum";

    setNeedChainSwitch(isCybriaMismatch || isEthereumMismatch);
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
      toast.success('🎉 Transaction successfull!');
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
      const spenderAddress = fromChain === "CYBRIA" ? cybriaAddress : ethereumAddress;
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

  

  // Helper function to parse amount based on token and chain
  const parseAmount = (amount, chain, token) => {
    if (chain === "ETHEREUM" && token === "CYBA") {
      // Use 9 decimals for CYBA on Base Sepolia
      return parseUnits(amount.toString(), 9);
    }
    // Use 18 decimals for all other cases
    return parseEther(amount.toString());
  };

  // Add this to the handleSend function
  const handleSend = useCallback(async () => {
    if (!writeContractAsync || !amount) return;

    try {
      setTransactionState("sending");

      const isCybria = fromChain === "CYBRIA";
      const dstChainId = isCybria ? CHAIN_IDS.ETHEREUM : CHAIN_IDS.CYBRIA;

      const srcToken = TOKENS[fromChain][selectedToken];
      const dstToken = TOKENS[isCybria ? "ETHEREUM" : "CYBRIA"][selectedToken];
      const contractAddress = isCybria ? cybriaAddress : ethereumAddress;
      const functionName = isCybria && selectedToken === "CYBA" ? "sendNative" : "send";

      const userInput = parseAmount(amount, fromChain, selectedToken);
      let txConfig = {
        address: contractAddress,
        abi,
        functionName,
      };

      if (isCybria && selectedToken === "CYBA") {
        const nativeUserInput = parseEther(amount.toString()) + fee; // Keep 18 decimals for native ETH
        txConfig.args = [address, dstToken, nativeUserInput, dstChainId, 0n, 5000];
        txConfig.value = nativeUserInput;
      } else {
        txConfig.args = [address, srcToken, dstToken, userInput, dstChainId, 1n, 10];
      }

      // console.log("Transaction config:", txConfig);
      const hash = await writeContractAsync(txConfig);
      setTxHash(hash);
      setTransactionState("confirming");
    } catch (err) {
      handleTransactionError(err);
    }
  }, [writeContractAsync, fromChain, selectedToken, amount, address, fee]);


  const handleTransactionError = (err) => {
    const message = err.message;
    if (message.includes("transfer exist")) {
      setErrorMessage("Transfer already exists. Change amount.");
    } else if (message.includes("InsufficientFunds")) {
      setErrorMessage("Insufficient Funds");
    } else if (message.includes("Arithmetic operation resulted in underflow or overflow")) {
      setErrorMessage("Amount is too small. Please increase the amount."); // New user-friendly message
    } else {
      setErrorMessage("Failed to send transaction");
      // console.error("Failed to send transaction:", err.message);
    }

    // Show toast for better visibility
    toast.error(
      message.includes("Arithmetic operation resulted in underflow or overflow")
        ? "Amount is too small. Please increase the amount."
        : "Transaction failed. Please try again."
    );

    // console.error("Failed to send transaction:", err.message);
    setTransactionState("error");
  };
  const isInsufficientBalance = () => {
    if (!amount) return false;

    const currentAmount = parseFloat(amount);
    const balance = parseFloat(formattedFromBalance);

    if (fromChain === "CYBRIA" && selectedToken === "CYBA" && fee) {
      const feeInEther = parseFloat(formatUnits(fee, 18));
      return currentAmount + feeInEther > balance;
    }

    return currentAmount > balance;
  };

  const getButtonText = () => {
    if (isInsufficientBalance()) {
      return "Insufficient Balance";
    }

    if (isTransactionCompleted) {
      return "Start New Transaction";
    }

    if (needChainSwitch) {
      return "Switch Network";
    }

    if (isFetchingFee && fromChain === "CYBRIA" && selectedToken === "CYBA") {
      return "Calculating Fee...";
    }

    if (!amount) {
      return "Enter Amount";
    }

    if (!needsApproval) {
      switch (transactionState) {
        case "idle": return "Transfer";
        case "sending": return "Initiating Transfer...";
        case "confirming": return "Confirming Transaction...";
        case "confirmed": return "Transfer Complete";
        case "error": return "Try Again";
        default: return "Transfer";
      }
    } else {
      switch (approvalState) {
        case "idle": return "Approve Token";
        case "approving": return "Approving...";
        case "confirming": return "Confirming Approval...";
        case "approved": return "Proceed with Transfer";
        case "error": return "Approval Failed - Try Again";
        default: return "Approve Token";
      }
    }
  };

  const isButtonDisabled = () => {
    if (isInsufficientBalance()) return true;
    if (isTransactionCompleted) return false;
    if (needChainSwitch) return false;
    if (!amount) return true;

    if (["sending", "confirming"].includes(transactionState)) return true;
    if (["approving", "confirming"].includes(approvalState)) return true;

    if (fromChain === "CYBRIA" && selectedToken === "CYBA") {
      return isFetchingFee || !fee;
    }

    return false;
  };
  
  // Modify handleButtonClick for better error handling
  const handleButtonClick = () => {
    try {
      if (isTransactionCompleted) {
        resetTransaction();
        return;
      }

      if (needChainSwitch) {
        handleSwitchChains();
        return;
      }

      // Don't proceed if there's no amount
      if (!amount) {
        toast.error('Please enter an amount');
        return;
      }

      // For Cybria CYBA transfers, ensure fee is ready
      if (fromChain === "CYBRIA" && selectedToken === "CYBA") {
        if (isFetchingFee) {
          toast.info('Please wait while fee is being calculated');
          return;
        }
        if (!fee) {
          toast.error('Fee calculation failed. Please try again');
          return;
        }
      }

      if (!needsApproval) {
        handleSend();
      } else {
        handleApprove();
      }
    } catch (error) {
      // console.error('Button click error:', error);
      toast.error('An error occurred. Please try again');
    }
  };

  const resetTransaction = () => {
    setTransactionState("idle");
    setApprovalState("idle");
    setIsTransactionCompleted(false);
    setAmount("");
    setTxHash(null);
    setApprovalTxHash(null);
  };

  return (
    <>
    <div className="ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
      <div className="p-2">

      <div>
          <p className="font-medium text-left mb-2 text-[hsl(220,8%,35%)]">Your Balances - undefined</p>
          <div className="grid md:grid-cols-2" >
            <div className="border border-secondary border-b-transparent md:border-b-secondary md:border-r-transparent flex flex-col items-start px-3 py-2" >
              <p className="text-light">Pooled</p>
              <p className="text-lg font-bold">0</p>
            </div>

            <div className="border border-secondary flex flex-col items-start px-3 py-2" >
              <p className="text-light">Staked</p>
              <p className="text-lg font-bold">0</p>
            </div>
          </div>
        </div>
        
        <p className="font-medium text-center mt-4 mb-2 text-[hsl(220,8%,35%)]">Choose the action</p>
        <div className="flex justify-center items-center mb-4">
          <button
            className={`px-4 py-2 border rounded-l ${
              option === "Unstake" ? "bg-darkModeGray text-white" : "bg-gray-200 text-darkModeGray"
            }`}
            onClick={() => setOption("Unstake")}
          >
            Unstake LP
          </button>
          <button
            className={`px-4 py-2 border rounded-r ${
              option === "Remove" ? "bg-darkModeGray text-white" : "bg-gray-200 text-darkModeGray"
            }`}
            onClick={() => setOption("Remove")}
          >
            Remove LP
          </button>
        </div>

        

        <div className="my-4">
          <p className="font-medium text-left mb-2 text-[hsl(220,8%,35%)]">Price Info</p>
          <div className="grid md:grid-cols-2" >
            <div className="border border-secondary border-b-transparent md:border-b-secondary md:border-r-transparent flex flex-col items-start px-3 py-2" >
              <p className="text-light">undefined</p>
              <p className="text-lg font-bold">0.00</p>
            </div>

            <div className="border border-secondary flex flex-col items-start px-3 py-2" >
              <p className="text-light">undefined</p>
              <p className="text-lg font-bold">0.00</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleButtonClick}
          disabled={isButtonDisabled()}
          className={`py-2 rounded-full mt-4 w-full 
          ${isInsufficientBalance()
              ? "bg-red-500 hover:bg-red-600"
              : isTransactionCompleted
                ? "bg-green-500 hover:bg-green-600"
                : transactionState === "error" || approvalState === "error"
                  ? "bg-red-500 hover:bg-red-600"
                  : "button_bg"
            } 
          text-white 
          transition-all duration-200
          ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
        `}
        >
          {getButtonText()}
        </button>

        {(transactionState === "error" || approvalState === "error") && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
    </>
  );
};





export default WithdrawLiquidity;
