import { RiArrowUpDownLine } from "react-icons/ri";

const SwitchDirection = ({ swapList, setSwapList, disabled, fromAmountChanged, fromAmountValue }) => {
  const newSwapList = [...swapList].reverse();

  const handleOnClick = () => {
    setSwapList(newSwapList);
  }
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="relative group">
        <RiArrowUpDownLine
          disabled={disabled}
          onClick={handleOnClick}
          className="button_bg rounded-md sm:w-[40px] sm:h-[40px] w-[30px] h-[30px] cursor-pointer sm:p-2 p-1 hover:bg-darkModeGray hover:text-white text-darkText dark:text-darkText"
        />
        <div className="absolute top-[140%] left-1/2 transform -translate-x-1/2 w-max p-2 text-xs text-darkText bg-darkBackground rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          Switch direction of bridge
        </div>
      </div>
    </div>
  );
}

export default SwitchDirection;