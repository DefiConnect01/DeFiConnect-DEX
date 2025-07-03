import { useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useAppKitProvider } from "@reown/appkit/react";
import stores from "../stores"; 
import { ACTIONS } from '../stores/constants/constants';

export const useWalletStateSync = () => {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { walletProvider } = useAppKitProvider("eip155");

  useEffect(() => {
    stores.accountStore.dispatcher.dispatch({
      type: ACTIONS.UPDATE_WALLET_STATE,
      content: {
        walletClient,
        walletProvider,
        isConnected,
      },
    });

    // Clear cached provider
    stores.accountStore.setStore({ web3provider: null });
  }, [isConnected, walletClient, walletProvider]);

  return { isConnected, walletClient, walletProvider };
};
