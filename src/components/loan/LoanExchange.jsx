import React, { useContext, useState } from "react";
import { AppDataContext } from "../../context/appContext";
import SelectTokenModal from "../TokenModal";

const LoanExchange = ({
    label,
    selectedToken,
    onTokenSelect,
    isDarkMode = true,
}) => {
  const [selectTokenModal, setSelectTokenModal] = useState(false);
  const { tokenList } = useContext(AppDataContext);

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
          <div className="">
            <p className="text-xl font-semibold">{selectedToken.symbol}/USDT</p>
            <em className="flex text-[#58585e] dark:text-[hsl(0,0%,65%)] text-sm">
                Stable Pool
            </em>
          </div>

        </div>

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

export default LoanExchange;
