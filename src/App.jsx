import { useState, useEffect } from "react";
import { Outlet ,useLocation, useNavigate} from 'react-router-dom';

// React Icon imports
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaTelegramPlane, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PiSunFill } from "react-icons/pi";

// Asset Image imports
// import LogoFooter from "./assets/logo_footer.png";
// import LogoFooterDark from "./assets/logo_footer_dark.png";
import Logo from "./assets/logo.png";
// import PageBackground from "./assets/bg_bridge.png";
import PageBackground from "./assets/bridge-backg.png";

// Component imports
import AddCustomToken from "./components/AddCustomToken";
import SelectTokenModal from "./components/SelectTokenModal";
import Header from "./components/Header";
import BridgeInfo from "./components/BridgeInfo";
import TransactionInterface from "./components/TransactionInterface";

// Hooks imports
import { useAccount } from "wagmi";
import ButtonList from "./components/shared/ButtonList";
import { useAppKitAccount } from "@reown/appkit/react";



// Modular Components
const NetworkButton = () => (
  <div className="bg-black  dark:bg-transparent flex rounded-full">
    <w3m-network-button />
  </div>
);

const ConnectButton = ({ isConnected }) => (
  <w3m-connect-button
    size="md"
    label={!isConnected ? "Connect to a wallet" : "Disconnect"}
  />
);

export  const TransactionsButton =({closeSidebar})=>{
  const navigate = useNavigate();

  const handleTransactionsClick = () => {

    navigate('/transactions');
    closeSidebar();
  };
  return <ButtonList onClick={handleTransactionsClick} border>
        Transactions
  </ButtonList>
}
const Sidebar = ({ closeSidebar, toggleDarkMode, isConnected }) => (
  <div className="relative w-[100%] left-0 z-30 gap-3 mt-12 flex px-6 items-start flex-col h-[100%] md:hidden">
    <TransactionsButton closeSidebar={closeSidebar}/>
    <NetworkButton />
    <ConnectButton isConnected={isConnected} />
    <BridgeInfo />
    <div
      className="hover:bg-[hsl(240,1%,56%)] rounded-md p-2 w-full"
      onClick={toggleDarkMode}
    >
      <PiSunFill className="h-8 w-8 text-[#8f60ff] dark:text-white" />
    </div>
  </div>
);

const TransferButton = () => (
  <div className="sm:mt-10 mt-6">
    <button className="bg-black dark:bg-white sm:text-2xl text-base font-bold flex justify-center items-center sm:py-2 rounded-full text-purple w-full">
      Transfer{" "}
      <IoIosArrowRoundForward style={{ width: "40px", height: "40px" }} />
    </button>
  </div>
);

const Footer = ({ isDarkMode }) => (
  <div className="px-8 w-full flex justify-between">
    {/* {isDarkMode ? (
      <img src={LogoFooter} alt="Logo" />
    ) : (
      <img src={LogoFooterDark} alt="Logo" />
    )} */}
    <div className="flex items-center gap-2">
      <img src={Logo} alt="Logo" className="w-6 h-6"/>
      <p className={` ${isDarkMode ? "text-white" : "text-black"} text-sm`}>DefiConnect</p>
    </div>
    <div className="flex gap-6 text-[#fffff]">
      {
        isDarkMode && ( 
          <>
            <FaTelegramPlane className="w-6 h-6 hover:cursor-pointer" />
            <FaXTwitter className="w-6 h-6 hover:cursor-pointer" />
            <FaGithub className="w-6 h-6 hover:cursor-pointer" /> 
          </>)
      }
      {
        !isDarkMode && (
          <> 
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#140084" />
                  <stop offset="100%" stopColor="#652400" />
                </linearGradient>
              </defs>
              <FaTelegramPlane style={{ fill: "url(#gradient)" }} className="w-6 h-6 hover:cursor-pointer" />
            </svg>

            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#140084" />
                  <stop offset="100%" stopColor="#652400" />
                </linearGradient>
              </defs>
              <FaXTwitter style={{ fill: "url(#gradient)" }} className="w-6 h-6 hover:cursor-pointer" />
            </svg>

            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#140084" />
                  <stop offset="100%" stopColor="#652400" />
                </linearGradient>
              </defs>
              <FaGithub  style={{ fill: "url(#gradient)" }} className="w-6 h-6 hover:cursor-pointer" />
            </svg>
          </>
        )
      }
    </div>
  </div>
);

// Main App
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectTokenModal, setSelectTokenModal] = useState(false);
  const [addCustomToken, setAddCustomToken] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  const location = useLocation()
  const isHomePage = location.pathname === '/';

  const backgroundSize = isHomePage ? "100vh" : "calc(max(70vw, 100vh))";



  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setIsDarkMode(true);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const currentMode = document.documentElement.classList.contains("dark");
    setIsDarkMode(currentMode);
    localStorage.setItem("theme", currentMode ? "dark" : "light");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div
        className="absolute flex justify-center text-center dark:bg-darkBackground bg-lightBackground t-0 l-0 w-full h-auto min-h-full dark:text-darkText text-lightText py-8"
        style={{
          backgroundImage: `url(${PageBackground})`,
          backgroundPosition: "center",
          backgroundSize: backgroundSize,
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full flex flex-col justify-between max-w-[1200px] relative">
          <Header
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isConnected={isConnected}
            address={address}
            toggleSidebar={toggleSidebar}
          />
          {isSidebarOpen && (
            <Sidebar
              closeSidebar={toggleSidebar}
              toggleDarkMode={toggleDarkMode}
              isConnected={isConnected}
            />
          )}

          <div className={`${isSidebarOpen ? "hidden" : "block"}`}>
            <Outlet context={{ isDarkMode, setSelectTokenModal: setSelectTokenModal,  }} />
          </div>

          <Footer isDarkMode={isDarkMode} />
        </div>
      </div>
      {selectTokenModal && (
        <SelectTokenModal
          selectTokenModal={selectTokenModal}
          setSelectTokenModal={setSelectTokenModal}
          setAddCustomToken={setAddCustomToken}
          isDarkMode={isDarkMode}
        />
      )}
      {addCustomToken && (
        <AddCustomToken
          setAddCustomToken={setAddCustomToken}
          addCustomToken={addCustomToken}
          setSelectTokenModal={setSelectTokenModal}
        />
      )}
    </>
  );
}

export default App;