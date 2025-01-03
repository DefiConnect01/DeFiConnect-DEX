import { useState, createContext } from "react";
import tokenList from "../constants/tokenList.json";

// Context should start with an uppercase letter
export const AppDataContext = createContext();


export default function AppContext({ children }) {
  const [fromChain, setFromChain] = useState("CYBRIA");
  const [selectedToken, setSelectedToken] = useState("ETH");


  return (
    <AppDataContext.Provider
      value={{ fromChain, setFromChain, selectedToken }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
