import React, { useContext, useState, useCallback, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { AppDataContext } from "../../context/appContext";
import { parseEther, formatUnits, parseUnits } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useSwitchChain,
  useBalance
} from "wagmi";
import { abi, ethereumAddress, cybriaAddress } from "../../constants";
import { toast } from 'react-toastify';
import { useAppKitAccount } from "@reown/appkit/react";
import stores from "../../stores";
import BigNumber from "bignumber.js";
import { ACTIONS, DEFAULT_ASSET_FROM, DEFAULT_ASSET_TO, CONTRACTS } from "../../stores/constants/constants";
import TokenInput from "../LiquidityTokenInput";
import SwitchDirection from "../LiquiditySwitchDirection";
import SearchBar from "../search/SearchBar";
import ChainSelection from "./ChainSelection";


// const CHAIN_IDS = {
//   CYBRIA: 6661,
//   BASE_SEPOLIA: 84532,
//   ETHEREUM: 1
// };
const CHAIN_IDS = {
  U2U: 284,
  BASE_SEPOLIA: 84532,
  CreatorTestnet:66665
};
// const TOKENS = {
//   CYBRIA: {
//     CYBA: "0x95622Fce49d65D1101f6FDa8b6325459A6188E52",
//     // USDT: "0x102bd5D18b2f6800ef4dcaF5fCe131fbb52aeBA4",
//   },
//   BASE_SEPOLIA: {
//     CYBA: "0xE5a4574B92A3D9528CFE9FC1a02F4983dBFd8aa1",
//     // USDT: "0xd1e728572AD0F0Bd8AD9EEf614C353CdE527929B",
//   }, ETHEREUM:{
//     CYBA: "0x1063181dc986F76F7eA2Dd109e16fc596d0f522A"
//   }
// };

const TOKENS = {
  U2UTestnet: {
    U2U: "",
    pUSDT: ""
    // USDT: "0x102bd5D18b2f6800ef4dcaF5fCe131fbb52aeBA4",
  },
  BASE_SEPOLIA: {
    ETH: "",
    USDT: ""
    // USDT: "0xd1e728572AD0F0Bd8AD9EEf614C353CdE527929B",
  },
   CreatorTestnet:{
    ETH: "",
    USDT: ""
  }
};


const TransactionChain = () => {
  const { setSelectTokenModal, isDarkMode } = useOutletContext();
  const { 
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken,
    tokenList,
    fromChain, 
    selectedToken
  } = useContext(AppDataContext);
  
  // ============================================
  const multiSwapStore = stores.multiSwapStore;
  const [slippage, setSlippage] = useState(0.5);

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [swapList, setSwapList] = useState([selectedFromToken, selectedToToken]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [fromAmountValue, setFromAmountValue] = useState("");
  const [fromAmountError, setFromAmountError] = useState(false);

  const [toAmountValue, setToAmountValue] = useState("");

  const [quoteError, setQuoteError] = useState(null);
  const [quote, setQuote] = useState(null);
  const [hidequote, sethidequote] = useState(true);
  // ====================================

  const [txHash, setTxHash] = useState(null);
  const [approvalTxHash, setApprovalTxHash] = useState(null);
  const [transactionState, setTransactionState] = useState("idle");
  const [approvalState, setApprovalState] = useState("idle");
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Error - Try Again");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState(null);
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const [formattedFromBalance, setFormattedFromBalance] = useState("0")

  const { switchChain } = useSwitchChain();
  const { address, isConnected } = useAppKitAccount()
  const { writeContractAsync } = useWriteContract();

  const isETH = swapList[0]?.symbol === "ETH";

  // use useEeffect to update token balance on switch
  const { data: fromBalanceData } = useBalance({
    address,
    chainId: swapList[0]?.chainId,
    token: isETH ? undefined : swapList[0]?.address, // Token is undefined for ETH
  });

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
    address: TOKENS[fromChain][selectedToken] || "",
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

  useEffect(() => {
    setSwapList([selectedFromToken, selectedToToken])
    console.log(swapList)
  }, [selectedFromToken, selectedToToken])

  useEffect(
    function () {
      const errorReturned = () => {
        if (quoteLoading) {
          toast.error("Error swapping tokens")
        }
        setQuoteLoading(false);
      };

      const quoteReturned = (val) => {
        // console.log('quoteReturned val', val)
        if (!val) {
          setQuoteLoading(false);
          setQuote(null);
          setToAmountValue("");
          setQuoteError(
            "Insufficient liquidity or no route available to complete swap"
          );
          toast.info("Insufficient liquidity or no route available to complete swap")
        }

        if (
          val &&
          val.inputs &&
          val.inputs.fromAmount === fromAmountValue
        ) {
          setQuoteLoading(false);
          if (BigNumber(val.output.finalValue).eq(0)) {
            setQuote(null);
            setToAmountValue("");
            setQuoteError(
              "Insufficient liquidity or no route available to complete swap"
            );
            toast.info("Insufficient liquidity or no route available to complete swap")
            return;
          }

          toast.success("Quote fetched successfully")
          setToAmountValue(BigNumber(val.output.finalValue).toFixed(8));
          // console.log('setquote')
          setQuote(val);
        }
      };

      const ssUpdated = () => {
        const baseAsset = stores.stableSwapStore.getStore("baseAssets");

        // set tokens for multiswap store
        if (
          baseAsset.length > 0
          && multiSwapStore.tokenIn === null
          && multiSwapStore.tokenOut === null
        ) {
            multiSwapStore.setTokenOut(DEFAULT_ASSET_TO)
            multiSwapStore.setTokenIn(DEFAULT_ASSET_FROM)
        }
        forceUpdate();
      };

      const swapReturned = (event) => {
        toast.success('🎉 Swapped Successfully!');
        setLoading(false);
        setFromAmountValue("");
        setToAmountValue("");
        sethidequote(false);
        // basically calculates nothing (because when swap returns we want the from amount to be 0)
        calculateReceiveAmount(0, swapList[0], swapList[1]);
        setQuote(null);
        setQuoteLoading(false);
      };
      
      const wrapReturned = () => {
        toast.success("🎉 Wrapped Successfully!")
        setLoading(false);
        setFromAmountValue("");
        setToAmountValue("");
        sethidequote(false);
        // basically calculates nothing (because when swap returns we want the from amount to be 0)
        calculateReceiveAmount(0, swapList[0], swapList[1]);
        setQuote(null);
        setQuoteLoading(false);
      };
      
      const unwrapReturned = () => {
        console.log(111)
        toast("🎉 Unwrapped Successfully!")
        setLoading(false);
        setFromAmountValue("");
        setToAmountValue("");
        sethidequote(false);
        // basically calculates nothing (because when swap returns we want the from amount to be 0)
        // calculateReceiveAmount(0, swapList[0], swapList[1]);
        setQuote(null);
        setQuoteLoading(false);
      };

      stores.emitter.on(ACTIONS.ERROR, errorReturned);
      stores.emitter.on(ACTIONS.UPDATED, ssUpdated);
      stores.emitter.on(ACTIONS.WRAP_RETURNED, wrapReturned);
      stores.emitter.on(ACTIONS.UNWRAP_RETURNED, unwrapReturned);
      stores.emitter.on(ACTIONS.SWAP_RETURNED, swapReturned);
      stores.emitter.on(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned);

      ssUpdated();

      return () => {
        stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
        stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated);
        stores.emitter.removeListener(ACTIONS.WRAP_RETURNED, wrapReturned);
        stores.emitter.removeListener(ACTIONS.UNWRAP_RETURNED, unwrapReturned);
        stores.emitter.removeListener(ACTIONS.SWAP_RETURNED, swapReturned);
        stores.emitter.removeListener(
          ACTIONS.QUOTE_SWAP_RETURNED,
          quoteReturned
        );
      };
    },
    [fromAmountValue, swapList]
  );

  const fromAmountChanged = (value) => {
    console.log(value)
    setFromAmountError(false);
    setFromAmountValue(value);
    setQuote(null);
    setToAmountValue("");
    if (value == "" || Number(value) === 0) {
      setQuoteLoading(false)
      setToAmountValue("");
      sethidequote(true);
    } else {
      if (swapList[0]?.symbol === CONTRACTS.WFTM_SYMBOL || swapList[1]?.symbol === CONTRACTS.WFTM_SYMBOL) {
        console.log("Wrap or unwrap")
        calculateReceiveAmount(value, swapList[0], swapList[1])
      } else {
        sethidequote(false);
        setQuoteLoading(true);
        setQuoteError(false);
        calculateReceiveAmount(value, swapList[0], swapList[1]);
      }
    }
  };


  const calculateReceiveAmount = (amount, from, to) => {
    if (multiSwapStore.isMultiswapInclude) {
      if (amount !== "" && !isNaN(amount) && to != null) {

        stores.dispatcher.dispatch({
          type: ACTIONS.QUOTE_SWAP,
          content: {
            fromAsset: from,
            toAsset: to,
            fromAmount: amount,
          },
        });
      }
    }
  };

  useEffect(() => {
    const updateBalance = () => {
      const fromTokenDecimals = fromBalanceData?.decimals || 18;

      const formattedBalance = fromBalanceData
        ? Number(formatUnits(fromBalanceData.value, fromTokenDecimals)).toFixed(2)
        : "0";

      setFormattedFromBalance(formattedBalance);
    };

    if (fromBalanceData) {
      updateBalance();
    }
  }, [fromBalanceData]);

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

  useEffect(() => {
    fromAmountChanged(fromAmountValue);
  }, [swapList])


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
    return quote && parseFloat(fromAmountValue) > parseFloat(formattedFromBalance)
  };

  const getButtonText = () => {
    if (!address) {
      return "Connect Wallet"
    }

    if (quoteLoading){
      // toast.info('Quote loading...');
      return "Quote loading..."
    }

    if (isInsufficientBalance()) {
      return "Insufficient Balance";
    }

    if (swapList[0]?.address == swapList[1]?.address) return "Same Token";

    if (isTransactionCompleted) {
      return "Start New Transaction";
    }

    if ((swapList[0]?.symbol === CONTRACTS.FTM_SYMBOL && swapList[1]?.symbol === CONTRACTS.WFTM_SYMBOL)) {
      return 'Wrap'
    }

    if (swapList[0]?.symbol === CONTRACTS.WFTM_SYMBOL && swapList[1]?.symbol === CONTRACTS.FTM_SYMBOL) {
      return 'Unwrap'
    }

    if (quote && parseFloat(fromAmountValue) < parseFloat(formattedFromBalance)) {
      return "Swap"
    } 
    
    if (!quote && fromAmountValue) {
      return "Route unavailable"
    }

    if (isFetchingFee) {
      return "Calculating Fee...";
    }

    if (!fromAmountValue || fromAmountValue == 0) {
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
        case "approving": return "Approving...";
        case "confirming": return "Confirming Approval...";
        case "approved": return "Proceed with Transfer";
        case "error": return "Approval Failed - Try Again";
      }
    }
  };

  const isButtonDisabled = () => {
    if (swapList[0]?.address == swapList[1]?.address) return true;
    if (loading) return true;
    if (!address) return true;
    if (isInsufficientBalance()) return true;
    if (isTransactionCompleted) return false;
    if (!fromAmountValue || fromAmountValue == 0) return true;
    if (!quote && fromAmountValue) return true;
    if (quoteLoading) return true;

    if (["sending", "confirming"].includes(transactionState)) return true;
    if (["approving", "confirming"].includes(approvalState)) return true;

    return false;
  };

  const makeSwap = async() => {
    setLoading(true)
    try {
      
      if (swapList[0]?.symbol === CONTRACTS.WFTM_SYMBOL && swapList[1]?.symbol === CONTRACTS.FTM_SYMBOL) { //Unwrap
        stores.dispatcher.dispatch({
          type: ACTIONS.UNWRAP,
          content: {
            fromAsset: swapList[0],
            toAsset: swapList[1],
            fromAmount: fromAmountValue,
            toAmount: quote.output.finalValue,
            quote: quote,
            slippage: slippage,
          },
        });
      } else if (swapList[0]?.symbol === CONTRACTS.FTM_SYMBOL && swapList[1]?.symbol === CONTRACTS.WFTM_SYMBOL) { //Wrap
        stores.dispatcher.dispatch({
          type: ACTIONS.WRAP,
          content: {
            fromAsset: swapList[0],
            toAsset: swapList[1],
            fromAmount: fromAmountValue,
            toAmount: quote.output.finalValue,
            quote: quote,
            // TODO: make slippage dynamic
            slippage: 50,
          },
        });
      } else {

        await stores.stableSwapStore.swap({
          content: {
            fromAsset: swapList[0],
            toAsset: swapList[1],
            fromAmount: fromAmountValue,
            quote: quote,
            // TODO: make slippage value dynamic
            slippage: 50,
          }
        })
      }
      await stores.stableSwapStore.loadBaseAssets()
    } catch (e) {
      // toast.error("Error occurred")
      console.log('error swapping', e)
    } finally {
      console.log("Done swapping")
    }
  }
  
  // Modify handleButtonClick for better error handling
  const handleButtonClick = () => {
    try {
      if (isTransactionCompleted) {
        resetTransaction();
        return;
      }

      // Don't proceed if there's no amount
      if (!fromAmountValue) {
        toast.error('Please enter an amount');
        return;
      }

      if (quote) {
        // do swap
        makeSwap()
      }

      if (isFetchingFee) {
        return;
      }
      if (!fee) {
        return;
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
    setFromAmountValue("");
    setTxHash(null);
    setApprovalTxHash(null);
  };

  const { data: toBalanceData } = useBalance({
          address,
          token: selectedToToken.address === "ETH" ? null : selectedToToken.address
        });
  
  const formattedToBalance = toBalanceData
    ? Number(formatUnits(toBalanceData.value, selectedToToken.decimals)).toFixed(2)
    : "0";

  return (
    <>
    <div className="w-full flex justify-center items-center">
      <SearchBar/>
    </div>

    <div className="w-full flex justify-center items-center">
      <ChainSelection/>
    </div>

    <div 
    className="shadow-glow shadow-glow-hover ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-8 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
      <div className="p-2">
        <TokenInput
          label="From"
          amount={fromAmountValue}
          setAmount={setFromAmountValue}
          selectedToken={selectedFromToken}
          onTokenSelect={setSelectedFromToken}
          disabled={transactionState !== "idle"}
          formattedBalance={formattedFromBalance}
          fee={fee}
          setSlippage={setSlippage}
          fromAmountChanged={fromAmountChanged}
        />
        <SwitchDirection
          disabled={transactionState !== "idle"}
            fromAmountChanged={fromAmountChanged}
          fromAmountValue={amount}
        />
        <TokenInput
         label="To"
         selectedToken={selectedToToken}
         onTokenSelect={setSelectedToToken}
         isReadOnly={true}
         formattedBalance={formattedToBalance}
         toAmountValue={toAmountValue}
        />

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



export default TransactionChain;
