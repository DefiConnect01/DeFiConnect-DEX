import { useState, createContext } from "react";
import tokenList from "../constants/tokenList.json";

// Context should start with an uppercase letter
export const AppDataContext = createContext();

export default function AppContext({ children }) {
  const [selectedFromToken, setSelectedFromToken] = useState(tokenList[0]);
  const [selectedToToken, setSelectedToToken] = useState(tokenList[1]);

  // const [fromChain, setFromChain] = useState("CYBRIA");
  // const [selectedToken, setSelectedToken] = useState("ETH");
  const [fromChain, setFromChain] = useState("baseSepolia");
  const [toChain, setToChain] = useState("u2u");

  return (
    <AppDataContext.Provider
      value={{
        tokenList,
        selectedFromToken,
        selectedToToken,
        setSelectedFromToken,
        setSelectedToToken,
        fromChain,
        setFromChain,
        toChain,
        setToChain
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
