import React, { useContext, useState } from "react";
import { AppDataContext } from "../context/appContext";
import SelectTokenModal from "./SelectTokenModal";
import AddCustomToken from "./AddCustomToken";
import PercentageButton from "./PercentageButton";
import CYBALogo from "../assets/cyba.svg";
import CYBALogoDark from "../assets/cyba_dark.svg";

const TokenInput = ({
  disabled,
  cybaPrice,
  label,
  chain,
  amount,
  setAmount,
  isReadOnly = false,
  formattedFromBalance,
  formattedToBalance,
  isDarkMode,
  fee,
}) => {
  const { fromChain, selectedToken, setSelectedToken } = useContext(AppDataContext);
  const [selectTokenModal, setSelectTokenModal] = useState(false);
  const [addCustomToken, setAddCustomToken] = useState(false);

  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      setAmount("");
      return;
    }

    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue)) {
      return;
    }

    setAmount(parsedValue.toString());
  };

  const getDisplayAmount = () => {
    if (!amount) return 0;

    const isCybriaChain = fromChain === "CYBRIA";
    const isCYBA = selectedToken === "CYBA";

    if (isReadOnly) {
      if (isCybriaChain && isCYBA) {
        return amount;
      } else {
        return amount * 0.995;
      }
    } else {
      if (isCybriaChain && isCYBA && fee) {
        const feeInEther = formatUnits(fee, 18);
        return (parseFloat(amount) + parseFloat(feeInEther)).toFixed(4);
      }
      return amount;
    }
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
      <div className={`${label === "To" ? "-mt-6" : ""} ml-2 text-start`}>
        <p className="font-medium dark:text-[hsl(220,8%,60%)] text-[hsl(220,8%,35%)] text-sm sm:text-base">{label}</p>
        <h2 className="sm:text-lg text-sm font-bold dark:text-[hsl(220,8%,60%)] text-[hsl(220,8%,35%)] mb-2">{chain}</h2>
      </div>

      <div className="p-4 flex flex-col bg-lightModeGray dark:bg-darkModeGray rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setSelectTokenModal(true)}
          >
            {selectedToken === "CYBA" ? (
              <img
                src={isDarkMode ? CYBALogoDark : CYBALogo}
                alt="CYBA logo"
                className="w-[30px] mr-1"
              />
            ) : (
              <img
                src="https://etherscan.io/token/images/centre-usdc_28.png"
                alt="USDT logo"
                className="w-[30px] mr-1"
              />
            )}
            <p className="sm:text-xl font-bold bg-transparent">{selectedToken}</p>
          </div>
          <em className="flex text-[#58585e] dark:text-[hsl(0,0%,65%)] text-sm">
            Balance: <span className="ml-1">{formattedFromBalance || formattedToBalance}</span>
          </em>
        </div>

        {!isReadOnly ? (
          <div className="text-left">
            <div className="flex justify-between">
              <input
                disabled={disabled}
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                className="dark:text-white font-normal sm:text-2xl bg-transparent outline-none w-full placeholder:text-black dark:placeholder:text-white"
              />
              <div className="flex gap-1">
                <PercentageButton percentage={10} formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
                <PercentageButton percentage={25} formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
                <PercentageButton percentage={50} formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
                <PercentageButton percentage="MAX" formattedFromBalance={formattedFromBalance} setAmount={setAmount} />
              </div>
            </div>
            {chain === "Cybria" && selectedToken === "CYBA" && fee && (
              <div className="mt-4 text-gray-500">
                Total with fee:{" "}
                <span className="text-lg font-semibold text-[#854CFF]">{getDisplayAmount()}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-black mr-auto dark:text-white font-normal sm:text-2xl bg-transparent outline-none">
            {getDisplayAmount()}
          </p>
        )}

        <em className="mr-auto mt-2 text-sm">
          ${selectedToken === "USDT" ? getDisplayAmount() : (getDisplayAmount() * cybaPrice).toFixed(4)}
        </em>
      </div>
    </div>
  );
};

export default TokenInput;
