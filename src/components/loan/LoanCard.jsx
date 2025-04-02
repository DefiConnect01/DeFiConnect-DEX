import React, { useState, useEffect } from 'react';
import LoanApprovalModal from './LoanApprovalModal';

const LoanCard = ({ token = "DCC", duration = 10, amount = "1.5" }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [showLiquidate, setShowLiquidate] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [walletData, setWalletData] = useState({
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    balance: "1.8",
    fee: "0.05"
  });

  
  const hasSufficientFunds = parseFloat(walletData.balance) >= parseFloat(amount);

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmApproval = () => {
    if (hasSufficientFunds) {
      setIsApproved(true);
      setShowModal(false);
      
      // Start countdown timer
      const countdown = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setShowLiquidate(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(countdown);
    }
  };

  const handleLiquidate = () => {
    alert(`Loan for ${amount} ${token} liquidated!`);
    // Additional liquidation logic would go here
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return (
    <>
      <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 dark:glassmorphic glassmorphic-dark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{token} Loan</h2>
          <div className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-black">
            {isApproved ? (
              showLiquidate ? "Expired" : `${formatTime(timeRemaining)} remaining`
            ) : "Pending Approval"}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="">Amount:</span>
            <span className="font-medium">{amount} {token}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="">Duration:</span>
            <span className="font-medium">{Math.floor(duration / 60)} minutes</span>
          </div>
        </div>
        
        <div className="mt-6">
          {!isApproved ? (
            <button 
              onClick={handleOpenModal}
              className="w-full bg-primary/80 hover:bg-primary text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Approve Loan
            </button>
          ) : showLiquidate ? (
            <button 
              onClick={handleLiquidate}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Liquidate Loan
            </button>
          ) : (
            <button 
              disabled
              className="w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded cursor-not-allowed"
            >
              Approved
            </button>
          )}
        </div>
      </div>

      
      {showModal && (
        <LoanApprovalModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmApproval}
          walletData={walletData}
          token={token}
          amount={amount}
          hasSufficientFunds={hasSufficientFunds}
        />
      )}
    </>
  );
};

export default LoanCard;