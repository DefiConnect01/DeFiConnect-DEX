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

const priceUpdateLink = import.meta.env.VITE_PRICE_UPDATE_LINK
const cyberApiKey = import.meta.env.VITE_CYBER_API_KEY


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
  const [txHash, setTxHash] = useState(null);
  const [transactionState, setTransactionState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Balance queries using token addresses from context
  const { data: fromBalanceData } = useBalance({
    address,
    token: selectedFromToken.address === "CETH" ? null : selectedFromToken.address
  });

  const { data: toBalanceData } = useBalance({
    address,
    token: selectedToToken.address === "CETH" ? null : selectedToToken.address
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

  const handleSend = async () => {
    if (!writeContractAsync || !amount) return;
    
    try {
      setTransactionState("sending");
      
      const parsedAmount = parseUnits(amount, selectedFromToken.decimals);
      
      // Handle transaction logic here based on selected tokens
      const txConfig = {
        address: selectedFromToken.address,
        abi: [], // Add appropriate ABI
        functionName: "transfer",
        args: [address, parsedAmount]
      };

      const hash = await writeContractAsync(txConfig);
      setTxHash(hash);
      setTransactionState("confirming");
    } catch (err) {
      setErrorMessage(err.message);
      setTransactionState("error");
    }
  };

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

    if (!amount) {
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
  }, [amount, isTransactionCompleted, transactionState, isInsufficientBalance]);

  // Check if button should be disabled
  const isButtonDisabled = useCallback(() => {
    if (isInsufficientBalance()) return true;
    if (isTransactionCompleted) return false;
    if (!amount) return true;

    return ["sending", "confirming"].includes(transactionState) ||
           ["approving", "confirming"].includes(approvalState);
  }, [amount, isTransactionCompleted, transactionState, approvalState, isInsufficientBalance]);

  // Handle button click
  const handleButtonClick = useCallback(async () => {
    // if (isTransactionCompleted) {
    //   // Reset transaction
    //   setAmount("");
    //   setTransactionState("idle");
    //   setApprovalState("idle");
    //   setIsTransactionCompleted(false);
    //   setTxHash(null);
    //   return;
    // }

    // if (isButtonDisabled()) return;
     setDepositLoading(true)
            
    try {
      await stores.dispatcher.dispatch({
        type: ACTIONS.CREATE_PAIR_AND_DEPOSIT, content: {
            token0: selectedFromToken,
            token1: selectedToToken,
            amount0: amount,
            amount1: amount,
            isStable: isStable,
            // should be slippage below
            slippage: slippage
        }
      });
    } catch (err) {
      toast.error('Transaction failed. Please try again.');
      setTransactionState("error");
    }
  }, [isTransactionCompleted, isButtonDisabled, handleSend]);

  return (
    <>
    {console.log(slippage)}
    <div className="ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
      <div className="p-2">
        <TokenInput
          label="From"
          amount={amount}
          setAmount={setAmount}
          selectedToken={selectedFromToken}
          onTokenSelect={setSelectedFromToken}
          disabled={transactionState !== "idle"}
          formattedBalance={formattedFromBalance}
          fee={fee}
          setSlippage={setSlippage}
        />
        <SwitchDirection
          disabled={transactionState !== "idle"}
          fromAmountChanged={handleAmountChange}
          fromAmountValue={amount}
          onSwitch={handleSwap}
        />
        <TokenInput
         label="To"
         selectedToken={selectedToToken}
         onTokenSelect={setSelectedToToken}
         isReadOnly={true}
         formattedBalance={formattedToBalance}
         toAmountValue={amount}
        />
        
        <div className="flex justify-center items-center my-4 mt-6">
          <button
            className={`px-4 py-2 border rounded-l ${
              isStable ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
            }`}
            onClick={() => setIsStable(true)}
          >
            Stable
          </button>
          <button
            className={`px-4 py-2 border rounded-r ${
              !isStable ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
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
              <p className="text-light">WMATIC</p>
              <p className="text-lg font-bold">1,194.15</p>
            </div>

            <div className="border border-secondary flex flex-col items-start px-3 py-2" >
              <p className="text-light">DYST</p>
              <p className="text-lg font-bold">19,262,538.96</p>
            </div>
          </div>
        </div>

        <div className="my-4">
          <p className="font-medium text-left mb-2 text-[hsl(220,8%,35%)]">Your Balances - WMATIC/DYST</p>
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
          // disabled={isButtonDisabled()}
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



export default TransactionLiquidity;
