import { useContext } from "react";
import { RiArrowUpDownLine } from "react-icons/ri";
import { AppDataContext } from "../context/appContext";

const SwitchDirection = ({ 
    disabled,
    fromAmountChanged,
    fromAmountValue,
    className
  }) => {
    const { 
      selectedFromToken,
      selectedToToken,
      setSelectedFromToken,
      setSelectedToToken 
    } = useContext(AppDataContext);
  
    const handleSwitch = () => {
      if (disabled) return;
  
      // Swap the tokens
      setSelectedFromToken(selectedToToken);
      setSelectedToToken(selectedFromToken);
  
      // Update amount if needed
      if (fromAmountChanged && fromAmountValue) {
        fromAmountChanged(fromAmountValue);
      }
    };
  
    return (
      <div className={`flex justify-center items-center mt-4 ${className}`}>
        <div className="relative group">
          <button
            disabled={disabled}
            onClick={handleSwitch}
            className={`
              flex items-center justify-center
              button_bg rounded-md 
              sm:w-[40px] sm:h-[40px] w-[30px] h-[30px] 
              transition-all duration-200
              ${disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-darkModeGray hover:text-white'
              }
              text-darkText dark:text-darkText
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            `}
            aria-label="Switch tokens direction"
          >
            <RiArrowUpDownLine 
              className={`
                sm:w-6 sm:h-6 w-5 h-5
                transition-transform duration-200
                group-hover:rotate-180
              `}
            />
          </button>
          
          {/* Tooltip */}
          <div className="
            absolute top-[140%] left-1/2 transform -translate-x-1/2 
            w-max p-2 
            text-xs text-darkText bg-darkBackground
            rounded-md 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-200
            pointer-events-none
            z-10
            shadow-lg
          ">
            Switch {selectedFromToken?.symbol} and {selectedToToken?.symbol}
          </div>
        </div>
  
        {/* Price Impact Indicator (optional) */}
        {selectedFromToken && selectedToToken && !disabled && (
          <div className="
            absolute right-[-60px]
            text-xs text-gray-500
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          ">
            {/* Add price impact calculation here if needed */}
          </div>
        )}
      </div>
    );
  };

export default SwitchDirection;