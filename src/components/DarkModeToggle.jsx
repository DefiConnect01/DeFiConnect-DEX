import { PiSunFill } from "react-icons/pi";

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => (
  <PiSunFill
    className="h-8 w-8 text-[#000] dark:text-white"
    onClick={toggleDarkMode}
  />
);

export default DarkModeToggle;
