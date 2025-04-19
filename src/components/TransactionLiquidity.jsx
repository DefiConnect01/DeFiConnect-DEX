import React, { useContext, useState, useCallback, useEffect } from "react";
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
import { toast } from 'react-toastify';
import TokenInput from "./LiquidityTokenInput";
import SwitchDirection from "./LiquiditySwitchDirection";

import stores from '../stores';
import { ACTIONS, CONTRACTS } from '../stores/constants/constants';
import { useAppKitAccount } from "@reown/appkit/react";
import BigNumber from "bignumber.js";
import SearchBar from "./search/SearchBar";


const TransactionLiquidity = () => {
  const {
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken,
    tokenList,
  } = useContext(AppDataContext);

  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [fee, setFee] = useState(null);
  const [isStable, setIsStable] = useState(false);
  const [transactionState, setTransactionState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState("");
  const [pair, setPair] = useState(null);
  const [pooledBalance, setPooledBalance] = useState("0.00");
  const [stakedBalance, setStakedBalance] = useState("0.00");

  // Price Info States
  const [token0Price, setToken0Price] = useState("0.00");
  const [token1Price, setToken1Price] = useState("0.00");

  // Priority Asset
  // Keep track of which field the user last modified
  const [lastModified, setLastModified] = useState(null); // 'one' or 'two'

  const { address } = useAppKitAccount()

  const { data: fromBalanceData } = useBalance({
      address,
      chainId: selectedFromToken?.chainId,
      token: selectedFromToken.address === "ETH" ? undefined : selectedFromToken?.address, // Token is undefined for ETH
    });

  const { data: toBalanceData } = useBalance({
      address,
      chainId: selectedToToken?.chainId,
      token: selectedToToken.address === "ETH" ? undefined : selectedToToken?.address, // Token is undefined for ETH
    });

  const formattedFromBalance = fromBalanceData
    ? Number(formatUnits(fromBalanceData.value, selectedFromToken.decimals)).toFixed(2)
    : "0";

  const formattedToBalance = toBalanceData
    ? Number(formatUnits(toBalanceData.value, selectedToToken.decimals)).toFixed(2)
    : "0";

  // Add handleAmountChange function
  const handleAmountChange = useCallback((value) => {
    if (!value || value === "") {
      setAmount("");
      return;
    }

    // Validate input is a valid number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    // Limit decimal places based on token decimals
    const decimals = selectedFromToken?.decimals || 18;
    const parts = value.split('.');
    if (parts[1] && parts[1].length > decimals) {
      value = `${parts[0]}.${parts[1].slice(0, decimals)}`;
    }

    setAmount(value);
  }, [selectedFromToken]);

  const handleSwap = useCallback(() => {
    // Store current amount
    const currentAmount = amount;

    // Swap tokens
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(selectedFromToken);

    // Clear amount and reset fee
    setAmount("");
    setFee(null);

    // If there was an amount, update it after token swap
    if (currentAmount) {
      // You might want to add price conversion logic here
      handleAmountChange(currentAmount);
    }
  }, [selectedFromToken, selectedToToken, amount, handleAmountChange]);

  useEffect(() => {
    const depositReturnedLiquidity = () => {
      setDepositLoading(false)
      setTokenTwoAmount("")
      setTokenOneAmount("");
      toast.success("Transaction completed")
    };

    const depositReturnedPair = () => {
      setDepositLoading(false)
      setTokenTwoAmount("")
      setTokenOneAmount("");
      toast.info("Pair Created")
    };

    const errorReturned = (e) => {
      setDepositLoading(false)
      console.log("Error", {e})
      // toast.error("Transaction failed")
    };

    const quoteAddReturned = (res) => {
      console.log({ "QUOTE ADD LIQ.": res.output });
    };

    const addLiquidityCallback = (params) => {
      setDepositLoading(true)
      stores.dispatcher.dispatch({
        type: ACTIONS.ADD_LIQUIDITY,
        content: {
          ...params,
          pair: {
            token0: selectedFromToken,
            token1: selectedToToken,
            isStable
          },
        }
      });
    }

    const ssUpdated = async () => {
      try {
        const token0IsETH =  selectedFromToken.address == "ETH";
        const token1IsETH =  selectedToToken.address == "ETH";
        
        // Find pair for selected tokens
        const currentPair = await stores.stableSwapStore.getPair(
          token0IsETH ? CONTRACTS.WFTM_ADDRESS : selectedFromToken.address,
          token1IsETH ? CONTRACTS.WFTM_ADDRESS : selectedToToken.address,
          isStable
        );

        console.log({currentPair})
        
        if (currentPair) {
          setPair(currentPair);
          
          // Update balances
          setPooledBalance(parseFloat(currentPair.balance).toFixed(2) || "0.00");
          setStakedBalance(currentPair.gauge?.balance || "0.00");
          
          // Update prices if available
          if (currentPair.reserve0 && currentPair.reserve1) {
            const price0 = BigNumber(currentPair.reserve0)
              // .div(currentPair?.token0?.decimals)
              .toFixed(2);
            const price1 = BigNumber(currentPair.reserve1)
              // .div(currentPair?.token1?.decimals)
              .toFixed(2);
            setToken0Price(price0);
            setToken1Price(price1);
          }
        }
      } catch (error) {
        console.error('Error updating pair data:', error);
      }
    };
    // Initial update
    ssUpdated();
    
    // Subscribe to events
    stores.emitter.on(ACTIONS.UPDATED, ssUpdated);
    stores.emitter.on(ACTIONS.ERROR, errorReturned);
    stores.emitter.on(ACTIONS.PAIR_CREATED, depositReturnedPair);
    stores.emitter.on(ACTIONS.LIQUIDITY_ADDED, depositReturnedLiquidity);
    stores.emitter.on(ACTIONS.ADD_LIQUIDITY_CALLBACK, addLiquidityCallback);
    stores.emitter.on(ACTIONS.QUOTE_ADD_LIQUIDITY_RETURNED, quoteAddReturned);

    return () => {
      // Cleanup listeners
      stores.emitter.removeListener(
        ACTIONS.LIQUIDITY_ADDED, 
        depositReturnedLiquidity
      );
      stores.emitter.removeListener(
        ACTIONS.PAIR_CREATED, 
        depositReturnedPair
      );
      stores.emitter.removeListener(
        ACTIONS.ADD_LIQUIDITY_CALLBACK, 
        addLiquidityCallback
      );
      stores.emitter.removeListener(
        ACTIONS.QUOTE_ADD_LIQUIDITY_RETURNED,
        quoteAddReturned
      );
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated);
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
    }
  }, [selectedFromToken, selectedToToken, isStable])

  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
  const [approvalState, setApprovalState] = useState("idle");

  const callQuoteAddLiquidity = (
    amountA,
    amountB,
    pa, //priority asset
    sta, //isStable
    pp, //pair
    assetA,
    assetB
  ) => {
    if (parseFloat(pp?.reserve0) != 0 && parseFloat(pp?.reserve1) != 0) {
      if (!pp) {
        return null;
      }

      let invert = false;

      let addy0 = assetA.address;
      let addy1 = assetB.address;

      if (assetA.address === "ETH") {
        addy0 = CONTRACTS.WFTM_ADDRESS;
      }
      if (assetB.address === "ETH") {
        addy1 = CONTRACTS.WFTM_ADDRESS;
      }

      if (
        addy1.toLowerCase() == pp.token0.address.toLowerCase() &&
        addy0.toLowerCase() == pp.token1.address.toLowerCase()
      ) {
        invert = true;
      }

      if (pa == 0) {
        if (amountA == "") {
          setTokenTwoAmount("");
        } else {
          if (invert) {
            amountB = BigNumber(amountA)
              .times(parseFloat(pp.reserve0))
              .div(parseFloat(pp.reserve1))
              .toFixed(
                parseFloat(pp.token0.decimals) > 6
                  ? 6
                  : parseFloat(pp.token0.decimals)
              );
          } else {
            amountB = BigNumber(amountA)
              .times(parseFloat(pp.reserve1))
              .div(parseFloat(pp.reserve0))
              .toFixed(
                parseFloat(pp.token1.decimals) > 6
                  ? 6
                  : parseFloat(pp.token1.decimals)
              );
          }
          setTokenTwoAmount(amountB);
        }
      }
      if (pa == 1) {
        if (amountB == "") {
          setTokenOneAmount("");
        } else {
          if (invert) {
            amountA = BigNumber(amountB)
              .times(parseFloat(pp.reserve1))
              .div(parseFloat(pp.reserve0))
              .toFixed(
                parseFloat(pp.token1.decimals) > 6
                  ? 6
                  : parseFloat(pp.token1.decimals)
              );
          } else {
            amountA = BigNumber(amountB)
              .times(parseFloat(pp.reserve0))
              .div(parseFloat(pp.reserve1))
              .toFixed(
                parseFloat(pp.token0.decimals) > 6
                  ? 6
                  : parseFloat(pp.token0.decimals)
              );
          }
          setTokenOneAmount(amountA);
        }
      }

      if (
        BigNumber(amountA).lte(0) ||
        BigNumber(amountB).lte(0) ||
        isNaN(amountA) ||
        isNaN(amountB)
      ) {
        return null;
      }

      stores.dispatcher.dispatch({
        type: ACTIONS.QUOTE_ADD_LIQUIDITY,
        content: {
          pair: pp,
          token0: pp.token0,
          token1: pp.token1,
          amount0: amountA,
          amount1: amountB,
          stable: sta,
        },
      });
    }
  };

  useEffect(() => {
    // Only run if we know which field was modified last
    if (!lastModified) return;

    // Set priority asset based on which field was last modified
    const priorityAsset = lastModified === 'one' ? 0 : 1;

    // Call the function with the correct priority asset
    callQuoteAddLiquidity(
      tokenOneAmount,
      tokenTwoAmount,
      priorityAsset,
      isStable,
      pair,
      selectedFromToken,
      selectedToToken
    );
  }, [tokenOneAmount, tokenTwoAmount, lastModified]);

  // handlers to set lastModified
  const handleTokenOneInput = (value) => {
    setTokenOneAmount(value);
    setLastModified('one');
  };

  const handleTokenTwoInput = (value) => {
    setTokenTwoAmount(value);
    setLastModified('two');
  };

  // Check if balance is sufficient
  const isInsufficientBalance = () => {
    return parseFloat(tokenOneAmount) > parseFloat(formattedFromBalance) 
    || parseFloat(tokenTwoAmount) > parseFloat(formattedToBalance);
  };

  // Get button text based on current state
  const getButtonText = useCallback(() => {
    if (isInsufficientBalance()) {
      return "Insufficient Balance";
    }

    if (selectedFromToken?.address == selectedToToken?.address) return "Same Token";

    if (isTransactionCompleted) {
      return "Start New Transaction";
    }

    if (!tokenOneAmount || !tokenTwoAmount) {
      return "Enter Amount";
    }

    switch (transactionState) {
      case "idle": return "Add Liquidity";
      case "sending": return "Adding Liquidity...";
      case "confirming": return "Confirming Transaction...";
      case "confirmed": return "Transaction Complete";
      case "error": return "Try Again";
      default: return "Add Liquidity";
    }
  }, [
      tokenOneAmount, 
      tokenTwoAmount, 
      isTransactionCompleted, 
      transactionState, 
      isInsufficientBalance
    ]
  );

  // Check if button should be disabled
  const isButtonDisabled = useCallback(() => {
    if (selectedFromToken?.address == selectedToToken?.address) return true;
    if (depositLoading) return true;
    if (!tokenOneAmount || !tokenTwoAmount) return true;
    if (isInsufficientBalance()) return true;
    if (isTransactionCompleted) return false;

    return ["sending", "confirming"].includes(transactionState) ||
      ["approving", "confirming"].includes(approvalState);
  }, [
      depositLoading, 
      tokenOneAmount, 
      tokenTwoAmount, 
      isTransactionCompleted, 
      transactionState, 
      approvalState, 
      isInsufficientBalance
    ]
  );

  // Handle button click
  const handleButtonClick = useCallback(async () => {

    // if (isButtonDisabled()) return;
    setDepositLoading(true)

    stores.dispatcher.dispatch({
      type: ACTIONS.CREATE_PAIR_AND_DEPOSIT,
      content: {
        token0: selectedFromToken,
        token1: selectedToToken,
        amount0: tokenOneAmount,
        amount1: tokenTwoAmount,
        isStable: isStable,
        slippage: 10 // TODO: create a UI for setting slippage
      }
    });
    
  }, [isTransactionCompleted, isButtonDisabled]);

  const [analysisResults, setAnalysisResults] = useState(null);
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const parameterFormat = {
    fromAmountValue: 0,
    selectedFromToken: "",
    formattedFromBalance: 0,
    toAmountValue: 0,
    selectedToToken: "",
    formattedToBalance: 0,
    isStable: false
  };
  
  const handleAnalysisComplete = (result, searchTerm) => {
    setAnalysisResults(result);
    setLastSearchTerm(searchTerm);
    
    if (!result) return;
    
    if (result.fromAmountValue !== undefined) {
      handleTokenOneInput(result.fromAmountValue);
    }
    
    if (result.selectedFromToken) {
      const fromToken = tokenList.find(token => token.symbol === result.selectedFromToken);
      if (fromToken) setSelectedFromToken(fromToken);
    }
    
    if (result.toAmountValue !== undefined) {
      handleTokenTwoInput(result.toAmountValue);
    }
    
    if (result.selectedToToken) {
      const toToken = tokenList.find(token => token.symbol === result.selectedToToken);
      if (toToken) setSelectedToToken(toToken);
    }
    
    if (result.isStable !== undefined) {
      setIsStable(result.isStable);
    }
  };

  return (
    <>
    {/* <div class="animated-border-box-glow"></div>animated-border-box */}
      <div className="w-full flex justify-center items-center mt-4">
        <SearchBar parameterFormat={parameterFormat}
          onAnalysisComplete={handleAnalysisComplete} placeholder="Liquidity with AI analysis..."/>
      </div>
      <div className="shadow-glow shadow-glow-hover ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-8 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
        <div className="p-2 ">
          <TokenInput
            label=""
            amount={tokenOneAmount}
            setAmount={setTokenOneAmount}
            fromAmountChanged={handleTokenOneInput}
            selectedToken={selectedFromToken}
            onTokenSelect={setSelectedFromToken}
            disabled={transactionState !== "idle"}
            formattedBalance={formattedFromBalance}
            fee={fee}
            setSlippage={setSlippage}
          />
          <SwitchDirection
            disabled={transactionState !== "idle"}
            fromAmountValue={amount}
            onSwitch={handleSwap}
            className="mb-4"
          />
          <TokenInput
            label=""
            amount={tokenTwoAmount}
            setAmount={setTokenTwoAmount}
            fromAmountChanged={handleTokenTwoInput}
            selectedToken={selectedToToken}
            onTokenSelect={setSelectedToToken}
            disabled={transactionState !== "idle"}
            formattedBalance={formattedToBalance}
            fee={fee}
            setSlippage={setSlippage}
          />
          <div className="flex justify-center items-center my-4 mt-6">
            <button
              className={`px-4 py-2 border rounded-l ${!isStable ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
                }`}
              onClick={() => setIsStable(false)}
            >
              Volatile
            </button>
            <button
              className={`px-4 py-2 border rounded-r ${isStable ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
                }`}
              onClick={() => setIsStable(true)}
            >
              Stable
            </button>
          </div>

          <div>
            <p className="font-medium text-left mb-2 text-black dark:text-[hsl(220,8%,35%)]">Reserve Info</p>
            <div className="grid md:grid-cols-2" >
              <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">{selectedFromToken.symbol}</p>
                <p className="text-lg font-bold">{token0Price}</p>
              </div>

              <div className="border border-secondaryBg flex flex-col items-start px-3 py-2" >
                <p className="text-light">{selectedToToken.symbol}</p>
                <p className="text-lg font-bold">{token1Price}</p>
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium text-left mb-2 text-black dark:text-[hsl(220,8%,35%)]">Your Balances - WETH/DCC</p>
            <div className="grid md:grid-cols-2" >
              <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">Pooled</p>
                <p className="text-lg font-bold">{pooledBalance}</p>
              </div>

              <div className="border border-secondaryBg flex flex-col items-start px-3 py-2" >
                <p className="text-light">Staked</p>
                <p className="text-lg font-bold">{stakedBalance}</p>
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
          
          hover:shadow-lg
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



export default TransactionLiquidity;
