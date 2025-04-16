import React, { useState, useRef, useEffect } from 'react';
import { FaEthereum, FaCaretDown, FaCheck } from 'react-icons/fa';
import { SiBitcoin, SiLitecoin, SiDogecoin, SiPolkadot } from 'react-icons/si';

const ChainSelection = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);
  const dropdownRef = useRef(null);

  const chains = [
    { id: 'baseSepolia', name: 'BaseSepolia', symbol: 'ETH', icon: <FaEthereum className="text-blue-500" />, color: 'bg-blue-100' },
    { id: 'u2uTestnet', name: 'U2uTestnet', symbol: 'U2U', icon: <SiBitcoin className="text-yellow-500" />, color: 'bg-yellow-100' },
    { id: 'creatorTestnet', name: 'Creator', symbol: 'ETH', icon: <SiBitcoin className="text-yellow-500" />, color: 'bg-yellow-100' },
  ];

  useEffect(() => {
    // Set default selection
    if (!selectedChain && chains.length > 0) {
      handleSelectChain(chains[0]);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelectChain = (chain) => {
    setSelectedChain(chain);
    setIsOpen(false);
    if (onSelect) {
      onSelect(chain);
    }
  };

  return (
    <div className="relative w-64 my-4" ref={dropdownRef}>
      {/* Selected Chain Button */}
      <button
        type="button"
        className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedChain && (
            <>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedChain.color} mr-3`}>
                {selectedChain.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-black">{selectedChain.name}</span>
                <span className="text-xs text-gray-500">{selectedChain.symbol}</span>
              </div>
            </>
          )}
        </div>
        <FaCaretDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {chains.map((chain) => (
            <div
              key={chain.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectChain(chain)}
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${chain.color} mr-3`}>
                  {chain.icon}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{chain.name}</span>
                  <span className="text-xs text-gray-500">{chain.symbol}</span>
                </div>
              </div>
              {selectedChain && selectedChain.id === chain.id && (
                <FaCheck className="text-green-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSelection;