import React, { useContext, useState, useCallback, useEffect } from "react";
import { AppDataContext } from "../../context/appContext";
import { parseEther, formatUnits, parseUnits } from "viem";
import {
  useBalance
} from "wagmi";
import { toast } from 'react-toastify';
import { useAppKitAccount } from "@reown/appkit/react";
import LoanDate from "./LoanDate";
import LoanInput from "./LoanInput";
import { Link } from "react-router-dom";
import { GiReturnArrow } from "react-icons/gi";
import moment from "moment";
import LoanExchange from "./LoanExchange";
import SearchBar from "../search/SearchBar";


const TransactionLoan = () => {
  const {
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken,
    tokenList
  } = useContext(AppDataContext);

  const [amount, setAmount] = useState("");
  const [loanValue, setLoanValue] = useState(0);
  const [fee, setFee] = useState(null);
  const [transactionState, setTransactionState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState("")
  const [tokenTwoAmount, setTokenTwoAmount] = useState("")

  const [LoanTime, setLoanTime] = useState(30)

  const { address } = useAppKitAccount()

  const { data: fromBalanceData } = useBalance({
      address,
      chainId: selectedFromToken?.chainId,
      token: selectedFromToken.address === "ETH" ? undefined : selectedFromToken?.address, // Token is undefined for ETH
    });

  const formattedFromBalance = fromBalanceData
    ? Number(formatUnits(fromBalanceData.value, selectedFromToken.decimals)).toFixed(2)
    : "0";


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
      return "Approve Transaction";
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

    setDepositLoading(true);
    
  }, [isTransactionCompleted, isButtonDisabled]);

  const [analysisResults, setAnalysisResults] = useState(null);
    const [lastSearchTerm, setLastSearchTerm] = useState('');
  
    const parameterFormat = {
      loanValue: 0,
      selectedLoanToken: "",
      selectedCollateralToken: ""
    };
    
    const handleAnalysisComplete = (result, searchTerm) => {
      setAnalysisResults(result);
      setLastSearchTerm(searchTerm);
  
      console.log(result);
      
      if (!result) return;

      
      if (result.selectedLoanToken) {
        const selectedToken = tokenList.find(token => token.symbol === result.selectedLoanToken);
        if (selectedToken) setSelectedToToken(selectedToken);
      }

      if (result.selectedCollateralToken) {
        const selectedToken = tokenList.find(token => token.symbol === result.selectedCollateralToken);
        if (selectedToken) setSelectedFromToken(selectedToken);
      }
      
      if (result.loanValue !== 0) {
        setLoanValue(result.loanValue);
      }
  
    };

  return (
    <>
    
      <div className="flex justify-start mb-4">
          <Link to="/" className="flex items-center bg-headerBg border border-secondaryBg pr-2 ">
              <span className="bg-secondaryBg text-white py-3 px-2 mr-2 text-xl"><GiReturnArrow /></span>
              <span className="font-bold py-2 px-3 text-white">Back</span>
          </Link>
      </div>

      <div className="w-full flex justify-center items-center my-4">
        <SearchBar parameterFormat={parameterFormat}
          onAnalysisComplete={handleAnalysisComplete} placeholder="Set Loan with AI analysis..."/>
      </div>

      <div className="shadow-glow shadow-glow-hover ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
        <div className="p-2">
            <LoanExchange
                label="Collateral Token"
                selectedToken={selectedFromToken}
                onTokenSelect={setSelectedFromToken}
                />
              <div className="my-4"></div>
            <LoanExchange
                label="Loan Token"
                selectedToken={selectedToToken}
                onTokenSelect={setSelectedToToken}
                />
            <div className="my-4"></div>
          <LoanInput
            setLoanValue={setLoanValue}
            selectedToken={selectedToToken}
            loanValue={loanValue}
          />
          <div className="my-4"></div>
          <LoanDate
            loanTime={30}
          />
          {/* <div className="flex items-center my-4 mt-6 rounded-full border ">
            <button
              className={`px-4 py-1 w-full rounded-full text-sm ${LoanTime === 7 ? "bg-primary text-white" : ""
                }`}
              onClick={() => setLoanTime(7)}
            >
              1 week
            </button>
            <button
              className={`px-4 py-1 w-full rounded-full text-sm ${LoanTime === 30 ? "bg-primary text-white" : ""
                }`}
              onClick={() => setLoanTime(30)}
            >
              1 month
            </button>

            <button
              className={`px-4 py-1 w-full rounded-full text-sm ${LoanTime === 188 ? "bg-primary text-white" : ""
                }`}
              onClick={() => setLoanTime(188)}
            >
              6 months
            </button>
            <button
              className={`px-4 py-1 w-full rounded-full text-sm ${LoanTime === 365 ? "bg-primary text-white" : ""
                }`}
              onClick={() => setLoanTime(365)}
            >
              1 year
            </button>
          </div> */}

          <div className="mt-6">
            {/* <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
                Loan period should be multiples of 1 week
                (e.g. 28, 35, 42 days, etc.)
            </p> */}
            <div className="grid md:grid-cols-2 my-3" >
              <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">
                    0 veDCC
                </p>
                <p className="text-lg font-bold">
                    Loan Amount
                </p>
              </div>

              <div className="border border-secondaryBg flex flex-col items-start px-3 py-2" >
                <p className="text-light">expires in {LoanTime} days</p>
                <p className="text-lg font-bold">until {moment().add(LoanTime, 'days').format("YYYY-DD-MM")}</p>
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
                Interest percentage 20%
            </p>
           
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



export default TransactionLoan;
