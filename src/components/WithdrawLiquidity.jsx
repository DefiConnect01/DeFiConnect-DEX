import React, { useContext, useState, useEffect } from "react";
import { AppDataContext } from "../context/appContext";
import { toast } from 'react-toastify';
import stores from '../stores';
import { ACTIONS, CONTRACTS } from '../stores/constants/constants';
import BigNumber from "bignumber.js";

const WithdrawLiquidity = () => {
  const { selectedFromToken, selectedToToken } = useContext(AppDataContext);
  
  // UI States
  const [option, setOption] = useState("Remove");
  const [errorMessage, setErrorMessage] = useState("Error - Try Again");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(10);
  
  // Store States
  const [pair, setPair] = useState(null);
  const [stable, setStable] = useState(true);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawQuote, setWithdrawQuote] = useState(null);
  const [pooledBalance, setPooledBalance] = useState("0.00");
  const [stakedBalance, setStakedBalance] = useState("0.00");
  
  // Price Info States
  const [token0Price, setToken0Price] = useState("0.00");
  const [token1Price, setToken1Price] = useState("0.00");

  useEffect(() => {
    const ssUpdated = async () => {
      try {
        // Get pairs from store
        const pairs = stores.stableSwapStore.getStore("pairs");

        const token0IsETH =  selectedFromToken.address == "ETH";
        const token1IsETH =  selectedToToken.address == "ETH";
        
        // Find pair for selected tokens
        const currentPair = await stores.stableSwapStore.getPair(
          token0IsETH ? CONTRACTS.WFTM_ADDRESS : selectedFromToken.address,
          token1IsETH ? CONTRACTS.WFTM_ADDRESS : selectedToToken.address,
          stable
        );

        console.log({selectedFromToken, selectedToToken, currentPair})
        
        if (currentPair) {
          toast.success("Pair fetched successfully")
          setPair(currentPair);
          
          // Update balances
          setPooledBalance(parseFloat(currentPair.balance).toFixed(6) || "0.00");
          setStakedBalance(currentPair.gauge?.balance || "0.00");
          
          // Update prices if available
          if (currentPair.reserve0 && currentPair.reserve1) {
            const price0 = BigNumber(currentPair.reserve0)
              // .div(currentPair.reserve0)
              .toFixed(2);
            const price1 = BigNumber(currentPair.reserve1)
              // .div(currentPair.reserve1)
              .toFixed(2);
            setToken0Price(price0);
            setToken1Price(price1);
          }
        } else {
          toast.info("Pair doesn't exist")
        }
      } catch (error) {
        console.error('Error updating pair data:', error);
        toast.error('Failed to load pair data');
      }
    };

    // Set up event listeners
    const depositReturned = () => {
      setDepositLoading(false);
      setAmount("");
      setWithdrawQuote(null);
      toast.success('Transaction completed successfully');
    };

    const errorReturned = () => {
      setDepositLoading(false);
      toast.error('Transaction failed');
    };

    const quoteRemoveReturned = (res) => {
      if (!res) return;
      setWithdrawQuote(res.output);
    };

    // Initial update
    ssUpdated();

    // Subscribe to events
    stores.emitter.on(ACTIONS.UPDATED, ssUpdated);
    stores.emitter.on(ACTIONS.LIQUIDITY_REMOVED, depositReturned);
    stores.emitter.on(ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED, depositReturned);
    stores.emitter.on(ACTIONS.QUOTE_REMOVE_LIQUIDITY_RETURNED, quoteRemoveReturned);
    stores.emitter.on(ACTIONS.ERROR, errorReturned);

    return () => {
      // Cleanup listeners
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated);
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_REMOVED, depositReturned);
      stores.emitter.removeListener(ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED, depositReturned);
      stores.emitter.removeListener(ACTIONS.QUOTE_REMOVE_LIQUIDITY_RETURNED, quoteRemoveReturned);
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
    };
  }, [selectedFromToken, selectedToToken, stable]);

  const handleButtonClick = async () => {
    if (!pair) {
      toast.error('No pair selected');
      return;
    }

    setDepositLoading(true);

    try {
      if (option === "Unstake") {
        await stores.dispatcher.dispatch({
          type: ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED,
          content: {
            pair,
            token0: selectedFromToken,
            token1: selectedToToken,
            percent: 100,
            slippage
          }
        });
      } else {
        await stores.dispatcher.dispatch({
          type: ACTIONS.REMOVE_LIQUIDITY,
          content: {
            pair,
            token0: selectedFromToken,
            token1: selectedToToken,
            percent: 100,
            slippage
          }
        });
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      // toast.error('Transaction failed. Please try again.');
      setDepositLoading(false);
    }
  };

  const getButtonText = () => {
    if (depositLoading) return "Transaction Pending...";
    if (!pair) return "Select Pair";
    return option === "Unstake" ? "Unstake LP" : "Remove LP";
  };

  return (
    <>
    {/* <div class="animated-border-box-glow"></div> */}
    <div className="shadow-glow shadow-glow-hover min-h-[400px] ml-[50%] bg-[hsla(0,1%,75%,.4)] border-2 dark:border-[#0A0D26] dark:bg-[#060A1A] text-lightText rounded-2xl dark:text-darkText transform translate-x-[-50%] mt-8 px-2 py-1 w-[95vw] max-w-[450px] flex flex-col sm:gap-4 gap-2">
      <div className="p-2">
        <div>
        {/* text-[hsl(220,8%,35%)] */}
          <p className="font-medium text-left mb-2 text-black dark:text-[hsl(220,8%,35%)]">Your Balances - {selectedFromToken?.symbol}/{selectedToToken?.symbol}</p>
          <div className="grid md:grid-cols-2">
            <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2">
              <p className="text-light">Pooled</p>
              <p className="text-lg font-bold">{pooledBalance}</p>
            </div>

            <div className="border border-secondaryBg flex flex-col items-start px-3 py-2">
              <p className="text-light">Staked</p>
              <p className="text-lg font-bold">{stakedBalance}</p>
            </div>
          </div>
        </div>
        
        <p className="font-medium text-center mt-4 mb-2 text-black dark:text-[hsl(220,8%,35%)]">Choose the action</p>
        <div className="flex justify-center items-center mb-4">
          <button
            className={`px-4 py-2 border rounded-l ${
              option === "Remove" ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
            }`}
            onClick={() => setOption("Remove")}
          >
            Remove LP
          </button>
          <button
            className={`px-4 py-2 border rounded-r ${
              option === "Unstake" ? "bg-mainBg text-white" : "bg-gray-200 text-darkModeGray"
            }`}
            onClick={() => setOption("Unstake")}
          >
            Unstake LP
          </button>
        </div>

        <div className="my-4">
          <p className="font-medium text-left mb-2 text-black dark:text-[hsl(220,8%,35%)]">Price Info</p>
          <div className="grid md:grid-cols-2">
            <div className="border border-secondaryBg border-b-transparent md:border-b-secondaryBg md:border-r-transparent flex flex-col items-start px-3 py-2">
              <p className="text-light">{selectedFromToken?.symbol}</p>
              <p className="text-lg font-bold">{token0Price}</p>
            </div>

            <div className="border border-secondaryBg flex flex-col items-start px-3 py-2">
              <p className="text-light">{selectedToToken?.symbol}</p>
              <p className="text-lg font-bold">{token1Price}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleButtonClick}
          disabled={depositLoading || !pair}
          className={`py-2 rounded-full mt-4 w-full 
            ${depositLoading
              ? "bg-gray-500"
              : !pair
                ? "bg-red-500"
                : "button_bg"
            } 
            text-white 
            transition-all duration-200
            ${depositLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
          `}
        >
          {getButtonText()}
        </button>

        {/* {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )} */}
      </div>
    </div>
    </>
  );
};

export default WithdrawLiquidity;