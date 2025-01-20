import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { ethers } from "ethers";

const AddCustomToken = ({
  isOpen,
  onClose,
  onAdd,
  onBack
}) => {
  const [tokenData, setTokenData] = useState({
    address: "",
    symbol: "",
    decimals: "",
    name: "",
    chainId: 66665 // Default chain ID
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!ethers.isAddress(tokenData.address)) {
      newErrors.address = "Invalid address format";
    }
    
    if (!tokenData.symbol) {
      newErrors.symbol = "Symbol is required";
    }
    
    if (!tokenData.decimals || tokenData.decimals < 0 || tokenData.decimals > 18) {
      newErrors.decimals = "Decimals must be between 0 and 18";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd({
        ...tokenData,
        decimals: parseInt(tokenData.decimals),
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png" // Default logo
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-[hsla(0,0%,0%,0.7)]" />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] rounded-2xl bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-4">Add Custom Token</h2>

        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1">Token Contract Address</p>
            <input
              className={`w-full bg-inherit border-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-2`}
              type="text"
              placeholder="0x..."
              value={tokenData.address}
              onChange={(e) => setTokenData({ ...tokenData, address: e.target.value })}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <p className="mb-1">Token Symbol</p>
            <input
              className={`w-full bg-inherit border-2 ${
                errors.symbol ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-2`}
              type="text"
              placeholder="ETH"
              value={tokenData.symbol}
              onChange={(e) => setTokenData({ ...tokenData, symbol: e.target.value.toUpperCase() })}
            />
            {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>}
          </div>

          <div>
            <p className="mb-1">Token Name</p>
            <input
              className="w-full bg-inherit border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-2"
              type="text"
              placeholder="Ethereum"
              value={tokenData.name}
              onChange={(e) => setTokenData({ ...tokenData, name: e.target.value })}
            />
          </div>

          <div>
            <p className="mb-1">Decimals of Precision</p>
            <input
              className={`w-full bg-inherit border-2 ${
                errors.decimals ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-2`}
              type="number"
              placeholder="18"
              value={tokenData.decimals}
              onChange={(e) => setTokenData({ ...tokenData, decimals: e.target.value })}
            />
            {errors.decimals && <p className="text-red-500 text-sm mt-1">{errors.decimals}</p>}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            onClick={handleSubmit}
          >
            Add Token
          </button>
        </div>

        <RxCross1
          className="absolute top-[-40px] right-[-40px] text-white h-10 w-10 cursor-pointer hover:bg-[hsla(213,20%,65%,0.1)] rounded-lg p-2 hidden sm:block"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default AddCustomToken;