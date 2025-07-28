import React, { useState } from "react";

const StakeTimeSelector = ({ options = [30, 60, 90, 120], onChange }) => {
  const [stakeTime, setStakeTime] = useState(options[0]);

  const handleSelect = (value) => {
    setStakeTime(value);
    onChange(value);
  };

  return (
    <div className="relative flex items-center justify-between w-full max-w-md p-1 mx-auto rounded-full border border-gray-300 bg-white shadow-sm">
      {/* Active Indicator */}
      <div
        className="absolute top-1 bottom-1 left-1 rounded-full bg-primary transition-all duration-300 ease-in-out"
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${options.indexOf(stakeTime) * 100}%)`,
        }}
      />
      
      {/* Buttons */}
      {options.map((value) => (
        <button
          key={value}
          className={`relative z-10 flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            stakeTime === value ? "text-white" : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleSelect(value)}
        >
          {value} days
        </button>
      ))}
    </div>
  );
};

export default StakeTimeSelector;
