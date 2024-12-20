import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from "../assets/logo.png";
import LogoDark from "../assets/logo_dark.png";
import MenuToggle from "../components/MenuToggle";
import DarkModeToggle from "../components/DarkModeToggle";
import BridgeInfo from "./BridgeInfo";
import { TransactionsButton } from "../App";

const NetworkButton = () => (
  <div className="bg-black py-[1px] dark:bg-transparent flex rounded-full">
    <w3m-network-button />
  </div>
);

const ConnectButton = ({ isConnected }) => (
  <div>
    <div className="hidden md:block lg:hidden">
      <w3m-connect-button
        size="md"
        label={!isConnected ? "Connect" : "Disconnect"}
      />
    </div>
    <div className="md:hidden lg:block">
      <w3m-connect-button
        size="md"
        label={!isConnected ? "Connect Wallet" : "Disconnect"}
      />
    </div>
  </div>
);

const Header = ({ isDarkMode, toggleDarkMode, isConnected, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTransactionsPage = location.pathname === '/transactions';

  return (
    <div className="flex justify-between items-center px-8">
      <div>
        <img
          src={isDarkMode ? Logo : LogoDark}
          alt="Logo"
          onClick={() => navigate("/")}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="hidden gap-8 items-center md:flex">
        {!isTransactionsPage && <TransactionsButton />}
        <NetworkButton />
        <ConnectButton isConnected={isConnected} />
        <BridgeInfo />
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <MenuToggle toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Header;