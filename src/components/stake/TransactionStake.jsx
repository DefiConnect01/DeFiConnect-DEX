import React, { useContext, useState, useCallback, useEffect } from "react";
import { AppDataContext } from "../../context/appContext";
import { parseEther, formatUnits, parseUnits } from "viem";
import {
  useBalance
} from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import moment from "moment";
import SearchBar from "../search/SearchBar";
import StakeInput from "./StakeInput";
import StakeDate from "./StakeDate";
import StakeTimeSelector from "./StakeTimeSelector";



const TransactionStake = () => {
  const {
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken
  } = useContext(AppDataContext);

  const [amount, setAmount] = useState("");
  const [stakeValue, setStakeValue] = useState(0);
  const [fee, setFee] = useState(null);
  const [transactionState, setTransactionState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState("")
  const [tokenTwoAmount, setTokenTwoAmount] = useState("")

  const [stakeTime, setStakeTime] = useState(7)

  const { address } = useAppKitAccount()
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
  const [approvalState, setApprovalState] = useState("idle");

  // Check if balance is sufficient
  // const isInsufficientBalance = useCallback(() => {
  //   if (!amount || !formattedFromBalance) return false;

  //   const currentAmount = parseFloat(amount);
  //   const balance = parseFloat(formattedFromBalance);

  //   if (fee) {
  //     const feeInToken = parseFloat(formatUnits(fee, selectedFromToken.decimals));
  //     return currentAmount + feeInToken > balance;
  //   }

  //   return currentAmount > balance;
  // }, [amount, formattedFromBalance, fee, selectedFromToken]);

  // Get button text based on current state
  // const getButtonText = useCallback(() => {
  //   if (isInsufficientBalance()) {
  //     return "Insufficient Balance";
  //   }

  //   if (isTransactionCompleted) {
  //     return "Start New Transaction";
  //   }

  //   if (!tokenOneAmount || !tokenTwoAmount) {
  //     return "Enter Amount";
  //   }

  //   switch (transactionState) {
  //     case "idle": return "Add Liquidity";
  //     case "sending": return "Adding Liquidity...";
  //     case "confirming": return "Confirming Transaction...";
  //     case "confirmed": return "Transaction Complete";
  //     case "error": return "Try Again";
  //     default: return "Add Liquidity";
  //   }
  // }, [tokenOneAmount, tokenTwoAmount, isTransactionCompleted, transactionState, isInsufficientBalance]);

  // // Check if button should be disabled
  // const isButtonDisabled = useCallback(() => {
  //   if (depositLoading) return true
  //   if (!tokenOneAmount || !tokenTwoAmount) return true;
  //   if (isInsufficientBalance()) return true;
  //   if (isTransactionCompleted) return false;

  //   return ["sending", "confirming"].includes(transactionState) ||
  //     ["approving", "confirming"].includes(approvalState);
  // }, [depositLoading, tokenOneAmount, tokenTwoAmount, isTransactionCompleted, transactionState, approvalState, isInsufficientBalance]);

  // Handle button click
  // const handleButtonClick = useCallback(async () => {

  //   setDepositLoading(true);
  //   console.log(moment().add(stakeTime, 'days').format("DD-MM-YYYY"));
  //   console.log(stakeValue)

  // }, [isTransactionCompleted, isButtonDisabled]);

  const [analysisResults, setAnalysisResults] = useState(null);
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const parameterFormat = {
    stakeValue: 0,
    stakeTime: "30 days"
  };

  const handleAnalysisComplete = (result, searchTerm) => {
    // setAnalysisResults(result);
    setLastSearchTerm(searchTerm);

    if (!result) return;

    if (lastSearchTerm === searchTerm) {
      return;
    }

    if (result.stakeValue !== 0) {
      setStakeValue(result.stakeValue);
    }

    if (result.stakeTime !== 0) {
      const validstakeTimes = ["30 days", "60 days", "90 days", "120 days"];

      if (validstakeTimes.includes(result.stakeTime)) {
        const lockDays = parseInt(result.stakeTime);
        setStakeTime(lockDays);
      } else {
        setStakeTime(120);
      }
    }

  };

  const [isStaking, setIsStaking] = useState(true);



  return (
    <>
      <div className="w-full flex justify-center items-center my-4">
        <SearchBar parameterFormat={parameterFormat}
          onAnalysisComplete={handleAnalysisComplete} placeholder="Set Stake with AI analysis..." />
      </div>

      <div className="shadow-glow shadow-glow-hover ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
        {/* Options */}

        <div className="flex justify-center items-center my-6">
          <div className="inline-flex rounded-full border border-gray-300 bg-gray-100 shadow-sm overflow-hidden">
            <button
              className={`relative flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all duration-300 ${isStaking
                ? "bg-mainBg text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setIsStaking(true)}
            >
              {isStaking && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
              Stake
            </button>
            <button
              className={`relative flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all duration-300 ${!isStaking
                ? "bg-mainBg text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setIsStaking(false)}
            >
              {!isStaking && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
              Unstake
            </button>
          </div>
        </div>

        <div className="p-2">
          <StakeInput
            setStakeValue={setStakeValue}
            stakeValue={stakeValue}
          />
          <div className="my-4"></div>
          <StakeDate
            stakeTime={stakeTime}
          />

          <div className="my-4 mt-6">
            <StakeTimeSelector options={[30, 60, 90, 120]} onChange={setStakeTime} />
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3>{isStaking ? "Stake" : "Unstake"}</h3>
              <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
                Balance: {0} DCC
              </p>
            </div>

            <div className="grid md:grid-cols-2 my-3" >
              <div className="text-sm border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">
                  You will receive
                </p>
                <p className="text-light">
                  Time left
                </p>
                <p className="text-light">
                  Available reward
                </p>
              </div>

              <div className="border border-secondaryBg flex flex-col items-end px-3 py-2 text-sm" >
                <p className="text-light">0 DCC</p>
                <p className="text-light">0</p>
                <p className="text-light">0 DCC</p>
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
              Statistics
            </p>

            <div className="grid md:grid-cols-2 my-3" >
              <div className="text-sm border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2" >
                <p className="text-light">
                  APY
                </p>
                <p className="text-light">
                  Protocol fee
                </p>
                <p className="text-light">
                  Staking pool total
                </p>
                <p className="text-light">
                  Your total stake
                </p>
              </div>

              <div className="border border-secondaryBg flex flex-col items-end px-3 py-2 text-sm" >
                <p className="text-light">0%</p>
                <p className="text-light">0</p>
                <p className="text-light">0 DCC</p>
                <p className="text-light">0 DCC</p>
              </div>
            </div>

          </div>

          <button
            // onClick={handleButtonClick}
            // disabled={isButtonDisabled()}
            // className={`py-2 rounded-full mt-4 w-full 
          // ${isInsufficientBalance()
          //       ? "bg-red-500 hover:bg-red-600"
          //       : isTransactionCompleted
          //         ? "bg-green-500 hover:bg-green-600"
          //         : transactionState === "error" || approvalState === "error"
          //           ? "bg-red-500 hover:bg-red-600"
          //           : "button_bg"
          //     } 
          //     text-white 
          //     transition-all duration-200
              
          //     hover:shadow-lg
          //     ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"} 
          //   `}
          >
             {/* {getButtonText()} */}
             {}
          </button>

          {/* {(transactionState === "error" || approvalState === "error") && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )} */}
        </div>
      </div>
    </>
  );
};



export default TransactionStake;
