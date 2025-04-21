import React from "react";
import { PiCoinsBold } from "react-icons/pi";

const LockInput = ({
  setLockValue,
  lockValue
}) => {
  return (
    <div>
      <div className="p-4 flex flex-col bg-lightModeGray dark:bg-darkModeGray rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 border-2 border-primary dark:border-white rounded-full">
            <PiCoinsBold className="text-3xl text-primary dark:text-white"/>
          </div>

          <div className="flex items-end justify-end flex-col">
            <input 
              type="number" 
              className="bg-inherit w-3/4 rounded-lg sm:p-2 p-1 text-right text-3xl font-semibold text-primary dark:text-textGray" 
              placeholder="0.00"
              value={lockValue || ""}
              onChange={(e) => setLockValue(e.target.value)}
            />
            <p className="font-bold">DCC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockInput;