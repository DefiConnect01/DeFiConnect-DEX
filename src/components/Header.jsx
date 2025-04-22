import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from "../assets/logo.png";
// import LogoDark from "../assets/logo_dark.png";
import MenuToggle from "./MenuToggle";
import DarkModeToggle from "./DarkModeToggle";
import BridgeInfo from "./BridgeInfo";
import { TransactionsButton } from "../App";
import { trimAddress } from "../lib/utils";
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import TransactionQueue from './transactionQueue/transactionQueue';
import { useAccount } from 'wagmi';
import stores from '../stores';
import { CONNECTION_CONNECTED } from '../stores/constants/actions';
import { ACTIONS } from '../stores/constants/constants';
// import  ACTIONS  from '../stores/constants/constants';
 import { ZNSContext } from '../context/znsContext';


const NetworkButton = () => (
  <div className="bg-black py-[1px] dark:bg-transparent flex rounded-full">
    <w3m-network-button />
  </div>
);

const ConnectButton = ({ isConnected, address }) => {
  // const { address, isConnected: connected } = useAppKitAccount()
  // const displayText = domain || (address ? trimAddress(address) : "Connect Wallet");
  // const displayText = (address ? trimAddress(address) : "Connect Wallet");
  return (
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
          label={!isConnected ? "Connect Wallet" : `${trimAddress(address)}`}
          // label={!isConnected ? "Connect Wallet" : displayText}

        />
       
      </div>
    </div>
  );
}


const Header = ({ isDarkMode, toggleDarkMode, isConnected, address, toggleSidebar }) => {
  const [transactionQueueLength, setTransactionQueueLength] = useState(0);
  // const { domain } = useZNS();
  // console.log(domain);
 
  // const { domains, isLoading, error } = useContext(ZNSContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isTransactionsPage = location.pathname === '/transactions';
 
  const { chainId } = useAppKitNetwork();

  // const generateDomainName = (walletAddress, attemptIndex = 0) => {
  //   if (!walletAddress) return '';
    
  //   // Start with 0x and include the next 3 characters
  //   let baseName = walletAddress.slice(0, 5).toLowerCase();
    
  //   // Add a suffix based on attempt number if this isn't the first try
  //   if (attemptIndex > 0) {
  //     baseName += attemptIndex.toString();
  //   }
    
  //   return baseName;
  // };

  

  
  useEffect(() => {

    const supportedChainIds = [process.env.NEXT_PUBLIC_CHAINID];
    const isChainSupported = supportedChainIds.includes(String(chainId));
    stores.accountStore.setStore({ chainInvalid: !isChainSupported });
    console.log({
      isConnected,
      chainId
    })

    if (isConnected) {
      stores.accountStore.setStore({
        account: { address },
        chainInvalid: false, // Adjust this based on chain validation logic
      });

      stores.emitter.emit(CONNECTION_CONNECTED);
      stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED);
      stores.dispatcher.dispatch({
        type: ACTIONS.CONFIGURE_SS,
        content: { connected: true },
      });
    }
  

  }, [isConnected, address]);

  return (
    <div className="flex justify-between items-center px-4 mb-12">
      <div className='flex items-center gap-2'>
        <img
          // src={isDarkMode ? Logo : LogoDark}
          src = {Logo}
          alt="Logo"
          onClick={() => navigate("/")}
          style={{ cursor: 'pointer' }}
          className='w-10 h-10'
        />
        <p className={` ${isDarkMode ? "text-white" : "text-black"} md:text-xl`}>DefiConnect
        {/* {domain && ` | ${domain}`} */}
          {/* {/* {isLoading && ' (Registering domain...)'} */}
        </p>
      </div>

      {/* {error && (
        <div className="text-red-500 text-sm">
          {error} */}
          {/* <button 
            onClick={handleRetry}
            disabled={isLoading}
            className="ml-2 px-2 py-1 bg-gray-100 rounded"
          >
            {isLoading ? 'Processing...' : 'Retry'}
          </button>
        </div> 
        // )} */}
      
    
      {/* <TransactionQueue setQueueLength={setTransactionQueueLength} /> */}
      <div className="hidden gap-8 items-center md:flex">
        {!isTransactionsPage && <TransactionsButton />}
        <NetworkButton />
        {/* <ConnectButton isConnected={isConnected} address={address} /> */}
        <ConnectButton isConnected={isConnected} address={address} />
        {/* <BridgeInfo /> */}
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <MenuToggle toggleSidebar={toggleSidebar} />
    
  
    </div>
   
  );
  
};

export default Header;

