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
import { ACTIONS } from '../stores/constants/constants';
import { useAppKitAccount } from "@reown/appkit/react";


const TransactionLiquidity = () => {
  const {
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken
  } = useContext(AppDataContext);

  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [fee, setFee] = useState(null);
  const [isStable, setIsStable] = useState(true);
  const [transactionState, setTransactionState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState("")
  const [tokenTwoAmount, setTokenTwoAmount] = useState("")

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

    const errorReturned = () => {
      setDepositLoading(false)
      // toast.error("Transaction failed")
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

    stores.emitter.on(ACTIONS.LIQUIDITY_ADDED, depositReturnedLiquidity);
    stores.emitter.on(ACTIONS.PAIR_CREATED, depositReturnedPair);
    stores.emitter.on(ACTIONS.ADD_LIQUIDITY_CALLBACK, addLiquidityCallback);
    stores.emitter.on(ACTIONS.ERROR, errorReturned);

    return () => {
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_ADDED, depositReturnedLiquidity);
      stores.emitter.removeListener(ACTIONS.PAIR_CREATED, depositReturnedPair);
      stores.emitter.removeListener(ACTIONS.ADD_LIQUIDITY_CALLBACK, addLiquidityCallback);
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
    }
  }, [])

  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
  const [approvalState, setApprovalState] = useState("idle");

  // Check if balance is sufficient
  const isInsufficientBalance = useCallback(() => {
    if (!amount || !formattedFromBalance) return false;

    const currentAmount = parseFloat(amount);
    const balance = parseFloat(formattedFromBalance);

    if (fee) {
      const feeInToken = parseFloat(formatUnits(fee, selectedFromToken.decimals));
      return currentAmount + feeInToken > balance;
    }

    return currentAmount > balance;
  }, [amount, formattedFromBalance, fee, selectedFromToken]);

  // Get button text based on current state
  const getButtonText = useCallback(() => {
    if (isInsufficientBalance()) {
      return "Insufficient Balance";
    }

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
  }, [tokenOneAmount, tokenTwoAmount, isTransactionCompleted, transactionState, isInsufficientBalance]);

  // Check if button should be disabled
  const isButtonDisabled = useCallback(() => {
    if (depositLoading) return true
    if (!tokenOneAmount || !tokenTwoAmount) return true;
    if (isInsufficientBalance()) return true;
    if (isTransactionCompleted) return false;

    return ["sending", "confirming"].includes(transactionState) ||
      ["approving", "confirming"].includes(approvalState);
  }, [depositLoading, tokenOneAmount, tokenTwoAmount, isTransactionCompleted, transactionState, approvalState, isInsufficientBalance]);

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

  return (
    <>
      <div className="ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
        <div className="p-2">
          <TokenInput
            label=""
            amount={tokenOneAmount}
            setAmount={setTokenOneAmount}
            fromAmountChanged={setTokenOneAmount}
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
            fromAmountChanged={setTokenTwoAmount}
            selectedToken={selectedToToken}
            onTokenSelect={setSelectedToToken}
            disabled={transactionState !== "idle"}
            formattedBalance={formattedToBalance}
            fee={fee}
            setSlippage={setSlippage}
          />
          <div className="flex justify-center items-center my-4 mt-6">
            <button
              className={`px-4 py-2 border rounded-l ${isStable ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
                }`}
              onClick={() => setIsStable(true)}
            >
              Stable
            </button>
            <button
              className={`px-4 py-2 border rounded-r ${!isStable ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
                }`}
              onClick={() => setIsStable(false)}
            >
              Volatile
            </button>
          </div>

          <div>
            <p className="font-medium text-left mb-2 text-[hsl(220,8%,35%)]">Reserve Info</p>
            <div className="grid md:grid-cols-2" >
              <div className="border border-secondary border-b-transparent md:border-b-secondary md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">WETH</p>
                <p className="text-lg font-bold">1,194.15</p>
              </div>

              <div className="border border-secondary flex flex-col items-start px-3 py-2" >
                <p className="text-light">DCC</p>
                <p className="text-lg font-bold">19,262,538.96</p>
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium text-left mb-2 text-[hsl(220,8%,35%)]">Your Balances - WETH/DCC</p>
            <div className="grid md:grid-cols-2" >
              <div className="border border-secondary border-b-transparent md:border-b-secondary md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">Pooled</p>
                <p className="text-lg font-bold">0.00</p>
              </div>

              <div className="border border-secondary flex flex-col items-start px-3 py-2" >
                <p className="text-light">Staked</p>
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
