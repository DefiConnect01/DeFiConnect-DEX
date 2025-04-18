import React, { useContext, useState } from "react";
import { AppDataContext } from "../context/appContext";
import SelectTokenModal from "./TokenModal";
import PercentageButton from "./PercentageButton";

const TokenInput = ({
  label,
  amount,
  setAmount,
  selectedToken,
  onTokenSelect,
  disabled,
  formattedBalance,
  isDarkMode = true,
  fee,
  isReadOnly = false,
  fromAmountChanged,
  toAmountValue,
  setSlippage,
  slippage
}) => {
  const [selectTokenModal, setSelectTokenModal] = useState(false);
  const { tokenList } = useContext(AppDataContext);

  const handleAmountChange = (value) => {
    fromAmountChanged(value)
  };

  const getDisplayAmount = () => toAmountValue || '0';

  return (
    <div>
      <div className={`${label === "To" ? "-mt-2" : ""} ml-2 text-start`}>
        <p className="font-medium dark:text-[hsl(220,8%,60%)] text-primary text-sm sm:text-base mb-2">
          {label}
        </p>
      </div>

      <div className="p-4 flex flex-col bg-lightModeGray dark:bg-darkModeGray rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setSelectTokenModal(true)}
          >
            <img
              src={selectedToken.logoURI}
              alt={`${selectedToken.symbol} logo`}
              className="w-[30px] mr-1 rounded-full"
            />
            <p className="sm:text-xl font-bold bg-transparent">{selectedToken.symbol}</p>
          </div>
          {formattedBalance && (
            <em className="flex text-[#58585e] dark:text-[hsl(0,0%,65%)] text-sm">
              Balance: <span className="ml-1">{formattedBalance} {selectedToken.symbol}</span>
            </em>
          )}
        </div>

        {!isReadOnly ? (
          <div className="text-left">
            <div className="flex justify-between">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                disabled={disabled}
                placeholder="0.0"
                className="dark:text-white font-normal sm:text-2xl bg-transparent outline-none w-full placeholder:text-black dark:placeholder:text-white"
              />
              <div className="flex gap-1">
                <PercentageButton setSlippage={setSlippage} percentage={10} formattedBalance={formattedBalance} setAmount={fromAmountChanged} />
                <PercentageButton setSlippage={setSlippage} percentage={25} formattedBalance={formattedBalance} setAmount={fromAmountChanged} />
                <PercentageButton setSlippage={setSlippage} percentage={50} formattedBalance={formattedBalance} setAmount={fromAmountChanged} />
                <PercentageButton setSlippage={setSlippage} percentage="MAX" formattedBalance={formattedBalance} setAmount={fromAmountChanged} />
              </div>
            </div>
            {fee && (
              <div className="mt-4 text-gray-500">
                Total with fee: <span className="text-lg font-semibold text-[#854CFF]">{getDisplayAmount()}</span>
              </div>
            )}
            {slippage && (
              <div className="mt-4 text-gray-500 text-xs">
                Total slippage: <span className=" font-semibold">{slippage}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-black mr-auto dark:text-white font-normal sm:text-2xl bg-transparent outline-none">
            {getDisplayAmount()}
          </p>
        )}

        <em className="mr-auto mt-2 text-sm">
          ${(Math.abs(Number(getDisplayAmount()))).toFixed(2)}
        </em>
      </div>

      <SelectTokenModal
        isOpen={selectTokenModal}
        onClose={() => setSelectTokenModal(false)}
        tokens={tokenList}
        onSelect={(token) => {
          onTokenSelect(token);
          onTokenSelect(token);
          setSelectTokenModal(false);
        }}
        selectedToken={selectedToken}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default TokenInput;
