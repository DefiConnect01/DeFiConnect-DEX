import React, { useState } from "react";
import Modal from "react-modal";
import { coinData } from "../constants/index";

Modal.setAppElement("#root");

const TokenModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");

  const filteredCoins = coinData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded shadow-md w-96"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select a Cryptocurrency</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <div className="flex flex-col space-y-2">
          {filteredCoins.map((coin) => (
            <div
              key={coin.symbol}
              className="flex justify-between items-center border-b py-2"
            >
              <div className="flex items-center space-x-3">
                <img src={coin.icon} alt={coin.name} className="w-6 h-6" />
                <span>{coin.name}</span>
              </div>
              <span className="font-medium">${coin.price}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default TokenModal;