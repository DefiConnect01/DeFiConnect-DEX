import { useState, createContext } from "react";

// Context should start with an uppercase letter
export const AppDataContext = createContext();

export default function AppContext({ children }) {
  const [fromChain, setFromChain] = useState("CYBRIA");
  const [selectedToken, setSelectedToken] = useState("CYBA");
  // const [tokensData, setTokensData] = useState({
  //   CYBRIA: {
  //     CYBA: "0x2cb527E7EebF5A679dda71e859c2A1aBceA800cb", //wCYBA
  //     USDT: "0x102bd5D18b2f6800ef4dcaF5fCe131fbb52aeBA4",
  //   },
  //   BASE_SEPOLIA: {
  //     CYBA: "0x2520789fbfD257d3782137660675E96D695F2eAd", //ERC20-Token or mCYBA
  //     USDT: "0xd1e728572AD0F0Bd8AD9EEf614C353CdE527929B",
  //   },
  // });

  return (
    <AppDataContext.Provider
      value={{ fromChain, setFromChain, selectedToken, setSelectedToken }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
