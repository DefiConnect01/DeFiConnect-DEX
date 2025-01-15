import React, { useContext, useState } from "react";
import { AppDataContext } from "../context/appContext";
import SelectTokenModal from "./SelectTokenModal";
import AddCustomToken from "./AddCustomToken";
import PercentageButton from "./PercentageButton";

const TokenInput = ({
  label,
  amount,
  setAmount,
  tokenDetails,
  selectedToken,
  disabled,
  formattedFromBalance,
  cybaPrice,
  isDarkMode,
  fee,
  fromChain,
  isReadOnly=false,
  fromAmountChanged,
  toAmountValue, setSlippage
  }) => {
  const [selectTokenModal, setSelectTokenModal] = useState(false);
  const [addCustomToken, setAddCustomToken] = useState(false);

  const handleAmountChange = fromAmountChanged;

  const getDisplayAmount = () => {
    
    return toAmountValue;
  };
  
  return (
    <div>
      {/* Add Custom Token Modal */}
      <AddCustomToken
        setAddCustomToken={setAddCustomToken}
        addCustomToken={addCustomToken}
        setSelectTokenModal={setSelectTokenModal}
      />

      {/* Select Token Modal */}
      <SelectTokenModal
        selectTokenModal={selectTokenModal}
        setSelectTokenModal={setSelectTokenModal}
        setAddCustomToken={setAddCustomToken}
        isDarkMode={isDarkMode}
      />

      {/* Main Token Input */}
      <div className={`${label === "To" ? "-mt-2" : ""} ml-2 text-start`}>
        <p className="font-medium dark:text-[hsl(220,8%,60%)] text-[hsl(220,8%,35%)] text-sm sm:text-base">{label}</p>
      </div>

      <div className="p-4 flex flex-col bg-lightModeGray dark:bg-darkModeGray rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setSelectTokenModal(true)}
          >
              <img
                src={tokenDetails?.logoURI}
                alt="USDT logo"
                className="w-[30px] mr-1 rounded-full"
              />
            <p className="sm:text-xl font-bold bg-transparent">{selectedToken}</p>
          </div>
          {
            formattedFromBalance && (
              <em className="flex text-[#58585e] dark:text-[hsl(0,0%,65%)] text-sm">
                Balance: <span className="ml-1">{formattedFromBalance} {tokenDetails?.symbol || selectedToken}</span>
              </em>
            )
          }
        </div>

        {!isReadOnly ? (
          <div className="text-left">
            <div className="flex justify-between">
              <input
                disabled={disabled}
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.0"
                className="dark:text-white font-normal sm:text-2xl bg-transparent outline-none w-full placeholder:text-black dark:placeholder:text-white"
              />
              <div className="flex gap-1">
                <PercentageButton setSlippage={setSlippage} percentage={10} formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
                <PercentageButton setSlippage={setSlippage} percentage={25} formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
                <PercentageButton setSlippage={setSlippage} percentage={50} formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
                <PercentageButton setSlippage={setSlippage} percentage="MAX" formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
              </div>
            </div>
            {selectedToken === "CYBA" && fee && (
              <div className="mt-4 text-gray-500">
                Total with fee:{" "}
                <span className="text-lg font-semibold text-[#854CFF]">{getDisplayAmount() || 0}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-black mr-auto dark:text-white font-normal sm:text-2xl bg-transparent outline-none">
            {getDisplayAmount() || 0}
          </p>
        )}

        <em className="mr-auto mt-2 text-sm">
          ${getDisplayAmount() || 0}
        </em>
      </div>
    </div>
  );
};

export default TokenInput;
