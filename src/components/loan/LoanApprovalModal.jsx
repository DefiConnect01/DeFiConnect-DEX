import React from 'react';

export const LoanApprovalModal = ({ 
  onClose, 
  onConfirm, 
  walletData, 
  token, 
  amount, 
  hasSufficientFunds 
}) => {
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Confirm Loan Approval</h3>
        
        <div className="space-y-3 mb-6">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet Address</p>
            <p className="font-mono">{formatAddress(walletData.address)}</p>
          </div>
          
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet Balance</p>
            <p className="font-semibold">{walletData.balance} {token}</p>
          </div>
          
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Loan Amount</p>
            <p className="font-semibold">{amount} {token}</p>
          </div>

          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fee</p>
            <p className="font-semibold">{walletData.fee} {token}</p>
          </div>

          {!hasSufficientFunds && (
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="text-sm text-red-500 dark:text-red-300">
                Insufficient funds for this loan
              </p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded text-white transition duration-200 ${
              hasSufficientFunds 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasSufficientFunds}
          >
            {hasSufficientFunds ? "Confirm Approval" : "Insufficient Funds"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default LoanApprovalModal;