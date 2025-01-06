import React, { useContext, useState, useCallback, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
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
import SwitchDirection from "./SwitchDirections";
import TokenInput from "./TokenInput";
import tokenList from "../constants/tokenList.json";
import { useAppKitAccount } from "@reown/appkit/react";
import stores from "../stores";
import { ACTIONS } from "../stores/constants/constants";

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

const TransactionInterface = () => {
  const multiSwapStore = stores.multiSwapStore;
  const { setSelectTokenModal, isDarkMode } = useOutletContext();
  const { 
    fromChain, 
    setFromChain, 
    selectedToken
  } = useContext(AppDataContext);

  // ============================================
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [swapList, setSwapList] = useState([tokenList[0], tokenList[1]]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [fromAmountValue, setFromAmountValue] = useState("");
  const [fromAmountError, setFromAmountError] = useState(false);
  const [fromAssetValue, setFromAssetValue] = useState(null);
  const [fromAssetError, setFromAssetError] = useState(false);
  const [fromAssetOptions, setFromAssetOptions] = useState([]);

  const [toAmountValue, setToAmountValue] = useState("");
  const [toAmountError, setToAmountError] = useState(false);
  const [toAssetValue, setToAssetValue] = useState(null);
  const [toAssetError, setToAssetError] = useState(false);
  const [toAssetOptions, setToAssetOptions] = useState([]);

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
  const [cybaPrice, setCybaPrice] = useState();
  const [fee, setFee] = useState(null);
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const [formattedFromBalance, setFormattedFromBalance] = useState("0")

  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
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


  // useEffect(
  //   function () {
  //     const errorReturned = () => {
  //       setLoading(false);
  //       setApprovalLoading(false);
  //       setQuoteLoading(false);
  //     };

  //     const quoteReturned = (val) => {
  //       // console.log('quoteReturned val', val)
  //       if (!val) {
  //         setQuoteLoading(false);
  //         setQuote(null);
  //         setToAmountValue("");
  //         setQuoteError(
  //           "Insufficient liquidity or no route available to complete swap"
  //         );
  //       }
  //       if (
  //         val &&
  //         val.inputs &&
  //         val.inputs.fromAmount === fromAmountValue &&
  //         val.inputs.fromAsset.address === fromAssetValue.address &&
  //         val.inputs.toAsset.address === toAssetValue.address
  //       ) {
  //         setQuoteLoading(false);
  //         if (BigNumber(val.output.finalValue).eq(0)) {
  //           setQuote(null);
  //           setToAmountValue("");
  //           setQuoteError(
  //             "Insufficient liquidity or no route available to complete swap"
  //           );
  //           return;
  //         }

  //         setToAmountValue(BigNumber(val.output.finalValue).toFixed(8));
  //         // console.log('setquote')
  //         setQuote(val);
  //       }
  //     };

  //     const ssUpdated = () => {
  //       const baseAsset = stores.stableSwapStore.getStore("baseAssets");

  //       // set tokens for multiswap store
  //       if (
  //         baseAsset.length > 0
  //         && multiSwapStore.tokenIn === null
  //         && multiSwapStore.tokenOut === null
  //       ) {
  //         if (router.query.to) {
  //           multiSwapStore.setTokenOut(router.query.to)
  //         } else {
  //           multiSwapStore.setTokenOut(DEFAULT_ASSET_TO)
  //         }

  //         if (router.query.from) {
  //           multiSwapStore.setTokenIn(router.query.from)
  //         } else {
  //           multiSwapStore.setTokenIn(DEFAULT_ASSET_FROM)
  //         }
  //       }

  //       setToAssetOptions(baseAsset);
  //       setFromAssetOptions(baseAsset);

  //       // set tokens for component state
  //       if (baseAsset.length > 0 && toAssetValue == null) {
  //         let toIndex
  //         if (router.query.to) {
  //           const index = baseAsset.findIndex((token) => {
  //             return token.address?.toLowerCase() === router.query.to.toLowerCase();
  //           });
  //           if (index !== -1) {
  //             toIndex = index
  //           }
  //         }

  //         if (toIndex === undefined) {
  //           toIndex = baseAsset.findIndex((token) => {
  //             return token.id.toLowerCase() === DEFAULT_ASSET_TO.toLowerCase();
  //           });
  //         }

  //         setToAssetValue(baseAsset[toIndex]);
  //       }

  //       if (baseAsset.length > 0 && fromAssetValue == null) {
  //         let fromIndex;

  //         if (router.query.from) {
  //           const index = baseAsset.findIndex((token) => {
  //             return token.id.toLowerCase() === router.query.from.toLowerCase();
  //           });
  //           if (index !== -1) {
  //             fromIndex = index
  //           }
  //         }

  //         if (fromIndex === undefined) {
  //           fromIndex = baseAsset.findIndex((token) => {
  //             return token.id.toLowerCase() === DEFAULT_ASSET_FROM.toLowerCase();
  //           });
  //         }

  //         setFromAssetValue(baseAsset[fromIndex]);
  //       }

  //       // update not inited tokens data
  //       if (fromAssetValue && fromAssetValue.chainId === 'not_inited') {
  //         // console.log('asset not inited')
  //         const foundBaIndex = baseAsset.findIndex((token) => {
  //           return token.id == fromAssetValue.address;
  //         });
  //         if (foundBaIndex) {
  //           setFromAssetValue(baseAsset[foundBaIndex])
  //         }
  //       }

  //       if (toAssetValue && toAssetValue.chainId === 'not_inited') {
  //         // console.log('asset not inited')
  //         const foundBaIndex = baseAsset.findIndex((token) => {
  //           return token.id == toAssetValue.address;
  //         });
  //         if (foundBaIndex) {
  //           setToAssetValue(baseAsset[foundBaIndex])
  //         }
  //       }

  //       forceUpdate();
  //     };

  //     const assetsUpdated = () => {
  //       const baseAsset = stores.stableSwapStore.getStore("baseAssets");
  //       setToAssetOptions(baseAsset);
  //       setFromAssetOptions(baseAsset);
  //     };

  //     const swapReturned = (event) => {
  //       setLoading(false);
  //       setFromAmountValue("");
  //       setToAmountValue("");
  //       if (
  //         !(
  //           (fromAssetValue?.symbol === FTM_SYMBOL ||
  //             fromAssetValue?.symbol === WFTM_SYMBOL) &&
  //           (toAssetValue?.symbol === WFTM_SYMBOL ||
  //             toAssetValue?.symbol === FTM_SYMBOL)
  //         )
  //       ) {
  //         sethidequote(false);
  //         calculateReceiveAmount(0, fromAssetValue, toAssetValue);
  //       }
  //       else {
  //         sethidequote(true);
  //         setToAmountValue(0);
  //       }
  //       setQuote(null);
  //       setQuoteLoading(false);
  //     };
  //     const wrapReturned = () => {
  //       setLoading(false);
  //     };

  //     stores.emitter.on(ACTIONS.ERROR, errorReturned);
  //     stores.emitter.on(ACTIONS.UPDATED, ssUpdated);
  //     stores.emitter.on(ACTIONS.WRAP_RETURNED, wrapReturned);
  //     stores.emitter.on(ACTIONS.UNWRAP_RETURNED, wrapReturned);
  //     stores.emitter.on(ACTIONS.SWAP_RETURNED, swapReturned);
  //     stores.emitter.on(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned);
  //     stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated);

  //     ssUpdated();

  //     return () => {
  //       stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
  //       stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated);
  //       stores.emitter.removeListener(ACTIONS.WRAP_RETURNED, wrapReturned);
  //       stores.emitter.removeListener(ACTIONS.UNWRAP_RETURNED, wrapReturned);
  //       stores.emitter.removeListener(ACTIONS.SWAP_RETURNED, swapReturned);
  //       stores.emitter.removeListener(
  //         ACTIONS.QUOTE_SWAP_RETURNED,
  //         quoteReturned
  //       );
  //       stores.emitter.removeListener(
  //         ACTIONS.BASE_ASSETS_UPDATED,
  //         assetsUpdated
  //       );
  //     };
  //   },
  //   [fromAmountValue, fromAssetValue, toAssetValue]
  // );

  const fromAmountChanged = (value) => {
    setFromAmountError(false);
    setFromAmountValue(value);
    setQuote(null);
    setToAmountValue("");
    if (value == "" || Number(value) === 0) {
      setQuoteLoading(false)
      setToAmountValue("");
      sethidequote(true);
      // setQuote(null);
    } else {
      sethidequote(false);
      calculateReceiveAmount(value, swapList[0], swapList[1]);
    }
  };

  const calculateReceiveAmount = (amount, from, to) => {
    if (multiSwapStore.isMultiswapInclude) {
      if (amount !== "" && !isNaN(amount) && to != null) {
        setQuoteLoading(true);
        setQuoteError(false);

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
  //   });
  // }, [transactionState, approvalState, amount, fromChain, selectedToken, fee, isFetchingFee, needsApproval, isTransactionCompleted]);

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
    if (!address) {
      return "Connect Wallet"
    }

    if (quoteLoading){
      return "Quote loading..."
    }

    if (isInsufficientBalance()) {
      return "Insufficient Balance";
    }

    if (isTransactionCompleted) {
      return "Start New Transaction";
    }


    if (isFetchingFee) {
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
        <TokenInput
          label="From"
          setSelectTokenModal={setSelectTokenModal}
          amount={fromAmountValue}
          setAmount={setFromAmountValue}
          tokenDetails={swapList[0]}
          selectedToken={swapList[0]["symbol"]}
          disabled={isTransactionCompleted}
          formattedFromBalance={formattedFromBalance}
          cybaPrice={cybaPrice}
          isDarkMode={isDarkMode}
          fee={fee}
          fromChain={fromChain}
          fromAmountChanged={fromAmountChanged}

        />
        <SwitchDirection
          swapList={swapList}
          setSwapList={setSwapList}
          disabled={isTransactionCompleted}
        />
        <TokenInput
          label="To"
          fromChain={fromChain}
          tokenDetails={swapList[1]}
          selectedToken={swapList[1]["symbol"]}
          isReadOnly
          amount={amount}
          cybaPrice={cybaPrice}
          isDarkMode={isDarkMode}
          fee={fee}
          toAmountValue={toAmountValue}
        />
        {!hidequote && (
          <div>
            <p>quote: {quote}</p>
              <p>quoteError: {quoteError}</p>
          </div>
        )}
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



export default TransactionInterface;
