import { useState, useContext } from "react";

import { CiGlobe } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";

import { AppDataContext } from "../context/appContext";

export default function BridgeInfo() {
  const [isSwitch, setIsSwitch] = useState(false);
  const { fromChain, setFromChain } = useContext(AppDataContext);

  return (
    <div
      onClick={() => setIsSwitch((prev) => !prev)}
      className="flex justify-center items-center gap-2 hover:cursor-pointer hover:bg-[hsl(240,3%,66%)] rounded-md p-2"
    >
      <CiGlobe className="text-[#854CFF] w-6 h-6" />
      <div className="relative">
        <div className="text-lg">
          {fromChain == "CYBRIA" ? "CYBA↔ETH" : "ETH↔CYBA"}
        </div>
        {isSwitch && (
          <div className="absolute bottom-[-90px] py-2  bg-[hsl(240,3%,36%)] text-lg">
            <div
              onClick={() => setFromChain("CYBRIA")}
              className="hover:bg-[hsl(240,3%,66%)] px-14 text-white"
            >
              CYBA↔ETH
            </div>
            <div
              onClick={() => setFromChain("BASE_SEPOLIA")}
              className="hover:bg-[hsl(240,3%,66%)] px-14 text-white"
            >
              ETH↔CYBA
            </div>
          </div>
        )}
      </div>
      <IoMdArrowDropdown />
    </div>
  );
}
