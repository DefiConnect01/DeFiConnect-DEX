import { useContext } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { AppDataContext } from "../context/appContext";

import CYBALogo from "../assets/cyba.svg"
import CYBALogoDark from "../assets/cyba_dark.svg"



export default function SelectTokenModal({
  selectTokenModal,
  setSelectTokenModal,
  setAddCustomToken,isDarkMode
}) {
  if (!selectTokenModal) return null;

  const { fromChain, setSelectedToken } = useContext(AppDataContext);

  // console.log(isDarkMode)

  


  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-[hsla(0,0%,0%,0.7)]"
        onClick={() => setSelectTokenModal(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] rounded-2xl bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-4 sm:p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold">Select a Token</h2>
          <h2
            className="text-[#854CFF] cursor-pointer hover:underline sm:hidden text-base"
            onClick={() => {
              setAddCustomToken(true); // Switch to Add Custom Token modal
              setSelectTokenModal(false); // Close this modal
            }}
          >
            + Custom
          </h2>
          <h2
            className="text-[#854CFF] cursor-pointer hover:underline hidden sm:block text-sm sm:text-md"
            onClick={() => {
              setAddCustomToken(true); // Switch to Add Custom Token modal
              setSelectTokenModal(false); // Close this modal
            }}
          >
            + Add Custom Token
          </h2>
        </div>
        <p className="text-[#7e7e7f] mb-2 text-sm sm:text-base">
          Search Name or Paste Token Contract Address
        </p>
        <div className="relative">
          <input
            className="w-full bg-inherit border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-1 sm:p-2"
            type="text"
            placeholder="Search..."
            autoFocus
          />
          <IoSearchOutline className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div
            className="flex justify-between border-2 border-gray-300 rounded-lg p-1 sm:p-2 hover:cursor-pointer"
            onClick={() => {
              setSelectedToken("CYBA");
              setSelectTokenModal(false);
            }}
          >
            <div className="flex gap-1 font-bold">


              <img src={`${isDarkMode  ? CYBALogoDark : CYBALogo}`} alt="CYBA logo" style={{ width: "30px" }} className="mr-1 dark:text-white" /> 
            
                          <p>CYBA</p>

            </div>
            <p>CYBA Coin from {fromChain === "CYBRIA" ? "Cybria" : "ETH"}</p>
          </div>
          <div
            className="flex justify-between border-2 border-gray-300 rounded-lg p-1 sm:p-2 hover:cursor-pointer"
            onClick={() => {
              setSelectedToken("USDT");
              setSelectTokenModal(false); // Close this modal
            }}
          >
            <div className="flex gap-1 font-bold"> <img src="https://etherscan.io/token/images/centre-usdc_28.png" alt="USDT logo" className="mr-1" />            <p>USDT</p>
</div>
            <p>
              {fromChain === "CYBRIA"
                ? "USDT Coin from Cybria"
                : "Tether USD from ETH"}
            </p>
          </div>
        </div>
        <RxCross1
          className="absolute top-[-40px] right-[-40px] text-white h-10 w-10 cursor-pointer hover:bg-[hsla(213,20%,65%,0.1)] rounded-lg p-2 hidden sm:block"
          onClick={() => setSelectTokenModal(false)}
        />
      </div>
    </div>
  );
}
