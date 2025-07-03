// Fixed Store class - removed hooks from class methods
import { ACTIONS, CONTRACTS } from "./constants";
import Multicall from "@dopex-io/web3-multicall";
import detectProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import stores from "../stores";
import Web3 from "web3";

class Store {
  constructor(dispatcher, emitter) {
    this.dispatcher = dispatcher;
    this.emitter = emitter;

    this.store = {
      account: null,
      chainInvalid: false,
      web3provider: null,
      web3modal: null,
      web3context: null,
      tokens: [],
      gasPrices: {
        standard: 90,
        fast: 100,
        instant: 130,
      },
      gasSpeed: "fast",
      currentBlock: 12906197,
      // Add these to store wagmi/appkit state
      walletClient: null,
      walletProvider: null,
      isWalletConnected: false,
    };

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case ACTIONS.CONFIGURE:
            this.configure(payload);
            break;
          // Add action to update wallet state from React components
          case ACTIONS.UPDATE_WALLET_STATE:
            this.updateWalletState(payload);
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return this.store[index];
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj };
    return this.emitter.emit(ACTIONS.STORE_UPDATED);
  }

  // Method to update wallet state from React components
  updateWalletState = (payload) => {
    const { walletClient, walletProvider, isConnected } = payload.content;
    this.setStore({
      walletClient,
      walletProvider,
      isWalletConnected: isConnected,
    });
  };

  configure = async () => {
    const supportedChainIds = [import.meta.env.VITE_PUBLIC_CHAINID];
    const provider = await detectProvider();
    this.getGasPrices();

    let providerChain = provider
      ? await provider.request({ method: "eth_chainId" })
      : null;

    this.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED);

    this.dispatcher.dispatch({
      type: ACTIONS.CONFIGURE_SS,
      content: { connected: false },
    });

    if (window.ethereum || provider ? provider : null) {
      // this.subscribeProvider();
    } else {
    }

    window.removeEventListener("ethereum#initialized", this.subscribeProvider);
    window.addEventListener("ethereum#initialized", this.subscribeProvider, {
      once: true,
    });
  };

  setProvider = async (provider) => {
    this.ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = this.ethersProvider.getSigner();
    this.provider = provider;

    try {
      const address = await signer.getAddress();
      this.setWalletAddress(address);
      // await this.getNetwork()
    } catch (error) {
      console.log(error);
    }
  };

  subscribeProvider = () => {
    const that = this;

    window.ethereum.on("accountsChanged", async function (accounts) {
      const address = accounts[0];
      await stores.stableSwapStore.configure();
      that.setStore({
        account: { address },
      });
      that.emitter.emit(ACTIONS.ACCOUNT_CHANGED);
      that.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED);
      that.dispatcher.dispatch({
        type: ACTIONS.CONFIGURE_SS,
        content: { connected: true },
      });
    });

    window.ethereum.on("chainChanged", async function (chainId) {
      const supportedChainIds = [import.meta.env.VITE_PUBLIC_CHAINID];
      const parsedChainId = parseInt(chainId + "", 16) + "";
      const isChainSupported = supportedChainIds.includes(parsedChainId);
      that.setStore({ chainInvalid: !isChainSupported });
      await stores.stableSwapStore.configure();
      that.emitter.emit(ACTIONS.ACCOUNT_CHANGED);
      that.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED);
      that.configure();
    });
  };

  getGasPrices = async (payload) => {
    const gasPrices = await this._getGasPrices();
    let gasSpeed = localStorage.getItem("dystopia.finance-gas-speed");

    if (!gasSpeed) {
      gasSpeed = "fast";
      localStorage.getItem("dystopia.finance-gas-speed", "fast");
    }

    this.setStore({ gasPrices: gasPrices, gasSpeed: gasSpeed });
    this.emitter.emit(ACTIONS.GAS_PRICES_RETURNED);
  };

  _getGasPrices = async () => {
    try {
      const web3 = await this.getWeb3Provider();
      const gasPrice = await web3.eth.getGasPrice();
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, "gwei");
      return {
        standard: gasPriceInGwei,
        fast: gasPriceInGwei,
        instant: gasPriceInGwei,
      };
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  getGasPrice = async (speed) => {
    let gasSpeed = speed;
    if (!speed) {
      gasSpeed = this.getStore("gasSpeed");
    }

    try {
      const web3 = await this.getWeb3Provider();
      const gasPrice = await web3.eth.getGasPrice();
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, "gwei");
      return gasPriceInGwei;
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  isWeb3ProviderExist = async () => {
    const hasEthereum = !!window?.ethereum;
    const hasProvider = await detectProvider();
    return hasEthereum || hasProvider;
  };

  getWeb3Provider = async () => {
    try {
      let web3provider = this.getStore("web3provider");

      if (web3provider !== null) {
        return web3provider;
      }

      // Get wallet state from store (updated by React components)
      const walletClient = this.getStore("walletClient");
      const walletProvider = this.getStore("walletProvider");
      const isWalletConnected = this.getStore("isWalletConnected");

      if (isWalletConnected && walletClient) {
        // Wallet is connected, use wallet client
        const provider = new Web3(walletClient.transport);
        this.setStore({ web3provider: provider });
        return provider;
      }

      if (walletProvider) {
        // AppKit provider available
        const provider = new Web3(walletProvider);
        this.setStore({ web3provider: provider });
        return provider;
      }

      // Check for window.ethereum as fallback (for desktop)
      if (window.ethereum) {
        const provider = new Web3(window.ethereum);
        this.setStore({ web3provider: provider });
        return provider;
      }

      // Check for detected provider
      const detectedProvider = await detectProvider();
      if (detectedProvider) {
        const provider = new Web3(detectedProvider);
        this.setStore({ web3provider: provider });
        return provider;
      }

      // For mobile browsers or when no wallet is connected
      // Use a read-only provider
      console.log("No wallet connected. Using read-only provider.");

      // Use environment variable or fallback to public RPC
      const rpcUrl =
        import.meta.env.VITE_RPC_URL;
      const readOnlyProvider = new Web3(rpcUrl);
      return readOnlyProvider;
    } catch (error) {
      console.error("Error getting web3 provider:", error);

      // Fallback to read-only provider
      const rpcUrl =
        import.meta.env.VITE_RPC_URL;
      return new Web3(rpcUrl);
    }
  };

  getMulticall = async () => {
    const web3 = await this.getWeb3Provider();
    const multicall = new Multicall({
      multicallAddress: CONTRACTS.MULTICALL_ADDRESS,
      provider: web3,
    });
    return multicall;
  };
}

export default Store;
