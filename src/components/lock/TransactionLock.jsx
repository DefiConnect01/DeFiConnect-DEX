// import React, { useContext, useState, useCallback, useEffect } from "react";
// import { AppDataContext } from "../../context/appContext";
// import { parseEther, formatUnits, parseUnits } from "viem";
// import {
//   useBalance
// } from "wagmi";
// import { toast } from 'react-toastify';

// import stores from '../../stores';
// import { ACTIONS } from '../../stores/constants/constants';
// import { useAppKitAccount } from "@reown/appkit/react";
// import LockDate from "./LockDate";
// import LockInput from "./LockInput";
// import { Link } from "react-router-dom";
// import { MdArrowBackIosNew } from "react-icons/md";
// import moment from "moment";
// import { GOV_TOKEN_ADDRESS } from "../../stores/constants/contractsTestnet";


// const TransactionLock = () => {
//   const {
    
//   } = useContext(AppDataContext);

//   const [amount, setAmount] = useState("");
//   const [lockValue, setLockValue] = useState(0);
//   const [fee, setFee] = useState(null);
//   const [isStable, setIsStable] = useState(true);
//   const [transactionState, setTransactionState] = useState("idle");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [depositLoading, setDepositLoading] = useState(false);
//   // const [tokenOneAmount, setTokenOneAmount] = useState("")
//   // const [tokenTwoAmount, setTokenTwoAmount] = useState("")
//   const [tokenAmount, setTokenAmount] = useState("")
 

//   const [lockTime, setLockTime] = useState(7)

//   const { address } = useAppKitAccount()

//   const { data: fromBalanceData } = useBalance({
//       address,
//       chainId: 66665,
//       token: GOV_TOKEN_ADDRESS, // Token is undefined for ETH
//       // chainId: selectedFromToken?.chainId,
//       // token: selectedFromToken.address === "ETH" ? undefined : selectedFromToken?.address, // Token is undefined for ETH
//     });

//   const { data: toBalanceData } = useBalance({
//       address,
//       chainId: 66665,
//       token: GOV_TOKEN_ADDRESS
//       // chainId: selectedToToken?.chainId,
//       // token: selectedToToken.address === "ETH" ? undefined : selectedToToken?.address, // Token is undefined for ETH
//     });

//   const formattedFromBalance = fromBalanceData
//     ? Number(formatUnits(fromBalanceData.value, GOV_TOKEN_ADDRESS.decimals)).toFixed(2)
//     : "0";

//   const formattedToBalance = toBalanceData
//     ? Number(formatUnits(toBalanceData.value, GOV_TOKEN_ADDRESS.decimals)).toFixed(2)
//     : "0";

//   // Add handleAmountChange function
//   const handleAmountChange = useCallback((value) => {
//     if (!value || value === "") {
//       setAmount("");
//       return;
//     }

//     // Validate input is a valid number
//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) return;

//     // Limit decimal places based on token decimals
//     // const decimals = selectedFromToken?.decimals || 18;
//     const decimals = GOV_TOKEN_ADDRESS?.decimals || 18;
//     const parts = value.split('.');
//     if (parts[1] && parts[1].length > decimals) {
//       value = `${parts[0]}.${parts[1].slice(0, decimals)}`;
//     }

//     setAmount(value);
//   }, [GOV_TOKEN_ADDRESS]);

//   const handleSwap = useCallback(() => {
//     // Store current amount
//     const currentAmount = amount;

//     // Swap tokens
//     // setSelectedFromToken(selectedToToken);
//     // setSelectedToToken(selectedFromToken);

//     // Clear amount and reset fee
//     setAmount("");
//     setFee(null);

//     // If there was an amount, update it after token swap
//     if (currentAmount) {
//       // You might want to add price conversion logic here
//       handleAmountChange(currentAmount);
//     }
//   }, [selectedFromToken, selectedToToken, amount, handleAmountChange]);

//   useEffect(() => {
//     const depositReturnedLiquidity = () => {
//       setDepositLoading(false)
//       setTokenTwoAmount("")
//       setTokenOneAmount("");
//       toast.success("Transaction completed")
//     };

//     const depositReturnedPair = () => {
//       setDepositLoading(false)
//       setTokeAmount("")
//       // setTokeAmount("")
//       // setTokenOneAmount("");
//       toast.info("Pair Created")
//     };

//     const errorReturned = () => {
//       setDepositLoading(false)
//       // toast.error("Transaction failed")
//     };

//     const addLiquidityCallback = (params) => {
//       setDepositLoading(true)
//       stores.dispatcher.dispatch({
//         type: ACTIONS.ADD_LIQUIDITY,
//         content: {
//           ...params,
//           pair: {
//             token0: selectedFromToken,
//             token1: selectedToToken,
//             isStable
//           },
//         }
//       });
//     }

//     stores.emitter.on(ACTIONS.LIQUIDITY_ADDED, depositReturnedLiquidity);
//     stores.emitter.on(ACTIONS.PAIR_CREATED, depositReturnedPair);
//     stores.emitter.on(ACTIONS.ADD_LIQUIDITY_CALLBACK, addLiquidityCallback);
//     stores.emitter.on(ACTIONS.ERROR, errorReturned);

//     return () => {
//       stores.emitter.removeListener(ACTIONS.LIQUIDITY_ADDED, depositReturnedLiquidity);
//       stores.emitter.removeListener(ACTIONS.PAIR_CREATED, depositReturnedPair);
//       stores.emitter.removeListener(ACTIONS.ADD_LIQUIDITY_CALLBACK, addLiquidityCallback);
//       stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
//     }
//   }, [])

//   const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
//   const [approvalState, setApprovalState] = useState("idle");

//   // Check if balance is sufficient
//   const isInsufficientBalance = useCallback(() => {
//     if (!amount || !formattedFromBalance) return false;

//     const currentAmount = parseFloat(amount);
//     const balance = parseFloat(formattedFromBalance);

//     if (fee) {
//       const feeInToken = parseFloat(formatUnits(fee, selectedFromToken.decimals));
//       return currentAmount + feeInToken > balance;
//     }

//     return currentAmount > balance;
//   }, [amount, formattedFromBalance, fee, selectedFromToken]);

//   // Get button text based on current state
//   const getButtonText = useCallback(() => {
//     if (isInsufficientBalance()) {
//       return "Insufficient Balance";
//     }

//     if (isTransactionCompleted) {
//       return "Start New Transaction";
//     }

//     if (!tokenOneAmount || !tokenTwoAmount) {
//       return "Enter Amount";
//     }

//     switch (transactionState) {
//       case "idle": return "Add Liquidity";
//       case "sending": return "Adding Liquidity...";
//       case "confirming": return "Confirming Transaction...";
//       case "confirmed": return "Transaction Complete";
//       case "error": return "Try Again";
//       default: return "Add Liquidity";
//     }
//   }, [tokenOneAmount, tokenTwoAmount, isTransactionCompleted, transactionState, isInsufficientBalance]);

//   // Check if button should be disabled
//   const isButtonDisabled = useCallback(() => {
//     if (depositLoading) return true
//     if (!tokenOneAmount || !tokenTwoAmount) return true;
//     if (isInsufficientBalance()) return true;
//     if (isTransactionCompleted) return false;

//     return ["sending", "confirming"].includes(transactionState) ||
//       ["approving", "confirming"].includes(approvalState);
//   }, [depositLoading, tokenOneAmount, tokenTwoAmount, isTransactionCompleted, transactionState, approvalState, isInsufficientBalance]);

//   // Handle button click
//   const handleButtonClick = useCallback(async () => {

//     setDepositLoading(true);
//     console.log(moment().add(lockTime, 'days').format("DD-MM-YYYY"));
//     console.log(lockValue)
    
//   }, [isTransactionCompleted, isButtonDisabled]);

//   return (
//     <>
//       <div className="flex justify-start mb-4">
//           <Link to="/" className="flex items-center bg-headerBg border border-secondaryBg pr-2 ">
//               <span className="bg-secondaryBg text-white py-3 px-2 mr-2 text-xl"><MdArrowBackIosNew /></span>
//               <span className="font-bold py-2 px-3 text-white">Back</span>
//           </Link>
//       </div>
//       <div className="ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
//         <div className="p-2">
//           <LockInput
//             setLockValue={setLockValue}
//           />
//           <div className="my-4"></div>
//           <LockDate
//             lockTime={lockTime}
//           />
//           <div className="flex items-center my-4 mt-6 rounded-full border ">
//             <button
//               className={`px-4 py-1 w-full rounded-full text-sm ${lockTime === 7 ? "bg-primary text-white" : ""
//                 }`}
//               onClick={() => setLockTime(7)}
//             >
//               1 week
//             </button>
//             <button
//               className={`px-4 py-1 w-full rounded-full text-sm ${lockTime === 30 ? "bg-primary text-white" : ""
//                 }`}
//               onClick={() => setLockTime(30)}
//             >
//               1 month
//             </button>

//             <button
//               className={`px-4 py-1 w-full rounded-full text-sm ${lockTime === 365 ? "bg-primary text-white" : ""
//                 }`}
//               onClick={() => setLockTime(365)}
//             >
//               1 year
//             </button>
//             <button
//               className={`px-4 py-1 w-full rounded-full text-sm ${lockTime === 1461 ? "bg-primary text-white" : ""
//                 }`}
//               onClick={() => setLockTime(1461)}
//             >
//               4 years
//             </button>
//           </div>

//           <div className="mt-6">
//             <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
//                 Lock period should be multiples of 1 week
//                 (e.g. 28, 35, 42 days, etc.)
//             </p>
//             <div className="grid md:grid-cols-2 my-3" >
//               <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2" >
//                 <p className="text-light">
//                     0 veDCC
//                 </p>
//                 <p className="text-lg font-bold">
//                     Voting power
//                 </p>
//               </div>

//               <div className="border border-secondaryBg flex flex-col items-start px-3 py-2" >
//                 <p className="text-light">expires in {lockTime} days</p>
//                 <p className="text-lg font-bold">until {moment().add(lockTime, 'days').format("YYYY-DD-MM")}</p>
//               </div>
//             </div>
//           </div>

//           <div className="my-4">
//             <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
//                 1 DCC locked for 1 years = 0.25 veDCC
//             </p>
           
//           </div>

//           <button
//             onClick={handleButtonClick}
//             disabled={isButtonDisabled()}
//             className={`py-2 rounded-full mt-4 w-full 
//           ${isInsufficientBalance()
//                 ? "bg-red-500 hover:bg-red-600"
//                 : isTransactionCompleted
//                   ? "bg-green-500 hover:bg-green-600"
//                   : transactionState === "error" || approvalState === "error"
//                     ? "bg-red-500 hover:bg-red-600"
//                     : "button_bg"
//               } 
//           text-white 
//           transition-all duration-200
          
//           hover:shadow-lg
//           ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"} 
//         `}
//           >
//             {getButtonText()}
//           </button>

//           {(transactionState === "error" || approvalState === "error") && (
//             <p className="text-red-500 mt-2">{errorMessage}</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };



// export default TransactionLock;




// import React, { useContext, useState, useCallback, useEffect } from "react";
// import { AppDataContext } from "../../context/appContext";
// import { parseEther, formatUnits, parseUnits } from "viem";
// import {
//   useBalance,
//   useWriteContract,
//   useReadContract,
//   useWaitForTransactionReceipt,
//   useSimulateContract,
//   useAccount
// } from "wagmi";
// import { toast } from 'react-toastify';

// import { Link } from "react-router-dom";
// import { MdArrowBackIosNew } from "react-icons/md";
// import moment from "moment";

// import LockDate from "./LockDate";
// import LockInput from "./LockInput";
// import { VE_TOKEN_ABI, VE_TOKEN_ADDRESS } from "../../stores/constants/contractsTestnet";


// const TransactionLock = () => {
//   const { address } = useAccount();
//   const [amount, setAmount] = useState("");
//   const [lockTime, setLockTime] = useState(7);
//   const [lockValue, setLockValue] = useState(0n);
//   // const [transactionState, setTransactionState] = useState("idle" | "sending" | "confirming" | "confirmed" | "error"| "idle");
//   const [transactionState, setTransactionState] = useState("idle");


//   // Prepare create lock transaction
//   // const { 
//   //   data: createLockData, 
//   //   write: createLock, 
//   //   isLoading: isCreateLockLoading 
//   // } =  usePrepareContractWrite({
//   //   address: VE_TOKEN_ADDRESS,
//   //   abi: VE_TOKEN_ABI,
//   //   functionName: 'createLock',
//   // });
//   const { 
//     data: createLockData, 
//     // write: createLock, 
//     // isLoading: isCreateLockLoading 
    
//     isLoading: isCreateLockLoading,
//     refetch: refetchCreateLock
//   } = useSimulateContract({
//     address: VE_TOKEN_ADDRESS,
//     abi: VE_TOKEN_ABI,
//     functionName: 'createLock',
//   });
//   const { write: createLock } = useWriteContract();

//     // Refetch on mount to ensure latest config
//   useEffect(() => {
//     refetchCreateLock();
//   }, [refetchCreateLock]);
//   // Wait for transaction confirmation
//   const { isSuccess: isCreateLockSuccess, isError: isCreateLockError } = useWaitForTransactionReceipt({
//     hash: createLockData?.hash,
//   });

//   // Calculate lock duration in seconds
//   const calculateLockDuration = useCallback(() => {
//     return BigInt(lockTime * 24 * 60 * 60); // Convert days to seconds
//   }, [lockTime]);

//   // Handle lock creation
//   const handleCreateLock = useCallback(async () => {
//     try {
//       // Validate inputs
//       if (!amount || lockValue === 0n) {
//         toast.error("Please enter a valid amount");
//         return;
//       }

//       // Convert amount to wei
//       const amountInWei = parseEther(amount);
//       console.log(amountInWei);

//       // Call create lock function
//       await createLock({
//         args: [amountInWei, calculateLockDuration()]
//       });

//       setTransactionState("sending");
//     } catch (error) {
//       console.error("Lock creation error:", error);
//       toast.error("Failed to create lock");
//       setTransactionState("error");
//     }
//   }, [amount, lockValue, createLock, calculateLockDuration]);

//   // Handle transaction state changes
//   useEffect(() => {
//     if (isCreateLockSuccess) {
//       setTransactionState("confirmed");
//       toast.success("Lock created successfully!");
//     }
//     if (isCreateLockError) {
//       setTransactionState("error");
//       toast.error("Transaction failed");
//     }
//   }, [isCreateLockSuccess, isCreateLockError]);

//   // Button text logic
//   const getButtonText = () => {
//     switch (transactionState) {
//       case "idle": return "Create Lock";
//       case "sending": return "Creating Lock...";
//       case "confirming": return "Confirming...";
//       case "confirmed": return "Lock Created";
//       case "error": return "Try Again";
//       default: return "Create Lock";
//     }
//   };

//   // Button disabled logic
//   const isButtonDisabled = () => {
//     return !amount || 
//            lockValue === 0n || 
//            transactionState === "sending" || 
//            transactionState === "confirming";
//   };


import React, { useContext, useState, useCallback, useEffect } from "react";
import { AppDataContext } from "../../context/appContext";
import { parseEther, formatUnits, parseUnits } from "viem";
import {
  useBalance,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
  useAccount
} from "wagmi";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import moment from "moment";

import LockDate from "./LockDate";
import LockInput from "./LockInput";
import { VE_TOKEN_ABI, VE_TOKEN_ADDRESS } from "../../stores/constants/contractsTestnet";

const TransactionLock = () => {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [lockTime, setLockTime] = useState(7);
  const [lockValue, setLockValue] = useState(0n);
  const [transactionState, setTransactionState] = useState("idle");

  // Simulate contract call first
  const { data: simulateData, isLoading: isSimulateLoading } = useSimulateContract({
    address: VE_TOKEN_ADDRESS,
    abi: VE_TOKEN_ABI,
    functionName: 'createLock',
    args: amount && lockTime ? [parseEther(amount), BigInt(lockTime * 24 * 60 * 60)] : undefined,
  });

  // Use writeContract hook
  const { writeContract, data: writeData, isError: isWriteError } = useWriteContract();

  // Wait for transaction confirmation
  const { isSuccess: isCreateLockSuccess, isError: isCreateLockError } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Calculate lock duration in seconds
  const calculateLockDuration = useCallback(() => {
    return BigInt(lockTime * 24 * 60 * 60); // Convert days to seconds
  }, [lockTime]);

  // Handle lock creation
  const handleCreateLock = useCallback(async () => {
    try {
      // Validate inputs
      if (!amount || lockValue === 0n) {
        toast.error("Please enter a valid amount");
        return;
      }

      // Convert amount to wei
      const amountInWei = parseEther(amount);
      console.log(amountInWei);

      setTransactionState("sending");

      // Write the contract with the correct configuration
      await writeContract({
        address: VE_TOKEN_ADDRESS,
        abi: VE_TOKEN_ABI,
        functionName: 'createLock',
        args: [amountInWei, calculateLockDuration()]
      });

    } catch (error) {
      console.error("Lock creation error:", error);
      toast.error("Failed to create lock");
      setTransactionState("error");
    }
  }, [amount, lockValue, writeContract, calculateLockDuration]);

  // Handle transaction state changes
  useEffect(() => {
    if (isCreateLockSuccess) {
      setTransactionState("confirmed");
      toast.success("Lock created successfully!");
    }
    if (isCreateLockError) {
      setTransactionState("error");
      toast.error("Transaction failed");
    }
  }, [isCreateLockSuccess, isCreateLockError]);

   //Button text logic
  const getButtonText = () => {
    switch (transactionState) {
      case "idle": return "Create Lock";
      case "sending": return "Creating Lock...";
      case "confirming": return "Confirming...";
      case "confirmed": return "Lock Created";
      case "error": return "Try Again";
      default: return "Create Lock";
    }
  };

  // Button disabled logic
  const isButtonDisabled = () => {
    return !amount || 
           lockValue === 0n || 
           transactionState === "sending" || 
           transactionState === "confirming";
  };

  return (
    <>
      <div className="flex justify-start mb-4">
        <Link to="/" className="flex items-center bg-headerBg border border-secondaryBg pr-2">
          <span className="bg-secondaryBg text-white py-3 px-2 mr-2 text-xl">
            <MdArrowBackIosNew />
          </span>
          <span className="font-bold py-2 px-3 text-white">Back</span>
        </Link>
      </div>
      <div className="ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-4 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
        <div className="p-2">
          <LockInput
            setLockValue={(value) => {
              setAmount(value.toString());
              setLockValue(parseEther(value.toString()));
            }}
          />
          <div className="my-4"></div>
          <LockDate lockTime={lockTime} />
          
          <div className="flex items-center my-4 mt-6 rounded-full border">
            {[
              { days: 7, label: "1 week" },
              { days: 30, label: "1 month" },
              { days: 365, label: "1 year" },
              { days: 1461, label: "4 years" }
            ].map((option) => (
              <button
                key={option.days}
                className={`px-4 py-1 w-full rounded-full text-sm ${lockTime === option.days ? "bg-primary text-white" : ""}`}
                onClick={() => setLockTime(option.days)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
              Lock period should be multiples of 1 week
              (e.g. 28, 35, 42 days, etc.)
            </p>
            <div className="grid md:grid-cols-2 my-3">
              <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2">
                <p className="text-light">
                  0 veDCC
                </p>
                <p className="text-lg font-bold">
                  Voting power
                </p>
              </div>

              <div className="border border-secondaryBg flex flex-col items-start px-3 py-2">
                <p className="text-light">expires in {lockTime} days</p>
                <p className="text-lg font-bold">
                  until {moment().add(lockTime, 'days').format("YYYY-DD-MM")}
                </p>
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium text-xs text-left mb-2 text-black dark:text-white">
              1 DCC locked for 1 years = 0.25 veDCC
            </p>
          </div>

          <button
            onClick={handleCreateLock}
            disabled={isButtonDisabled()}
            className={`py-2 rounded-full mt-4 w-full 
              ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : "button_bg"}
              text-white transition-all duration-200 hover:shadow-lg
            `}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </>
  );
};

export default TransactionLock;
