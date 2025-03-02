import { useState, useContext, useMemo, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { AppDataContext } from "../context/appContext";
import { useBalance } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";

// Create a separate TokenWithBalance component to use the hook properly
const TokenWithBalance = ({ token, address, onSelect, onClose }) => {
  const { data } = useBalance({
    address,
    chainId: token?.chainId,
    token: token?.symbol === "ETH" ? undefined : token?.address, // Token is undefined for ETH
  });

  // Combine token with its balance data
  const tokenWithBalance = {
    ...token,
    data
  };

  return (
    <div
      key={token.address}
      className="flex justify-between items-center border-2 border-gray-300 rounded-lg p-2 sm:p-3 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => {
        onSelect(tokenWithBalance);
        onClose();
      }}
    >
      <div className="flex items-center gap-2">
        <img
          src={token.logoURI}
          alt={`${token.symbol} logo`}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col items-start">
          <p className="font-bold">{token.symbol}</p>
          <p className="text-sm text-gray-500">{token.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm">{parseFloat(data?.formatted || 0).toFixed(2)}<span className="font-bold"> {token?.symbol}</span></p>
        <p className="text-xs text-gray-500">{token.decimals} decimals</p>
      </div>
    </div>
  );
};

const SelectTokenModal = ({
  isOpen,
  onClose,
  onSelect,
  setAddCustomToken,
  isDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tokenList } = useContext(AppDataContext);
  const { address } = useAppKitAccount();
  const [tokens, setTokens] = useState([]);
  const [tokensWithBalances, setTokensWithBalances] = useState([]);

  // Fetch balances for all tokens
  useEffect(() => {
    const fetchBalances = async () => {
      if (!tokens.length || !address) return;

      // Create a copy of tokens with balance data
      const tokensWithBalanceData = [...tokens];
      setTokensWithBalances(tokensWithBalanceData);
    };

    fetchBalances();
  }, [tokens, address]);

  useEffect(() => {
    async function fetchAndUpdateTokenList() {
      const endpoint = import.meta.env.VITE_CREATOR_TOKEN_LIST_URL;

      // Define a hashmap for token icons with distinct URLs
      const tokenIconMap = {
        'WETH': 'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        'DAI': 'https://i.ibb.co/vQTj584/dai.jpg',
        'BTC': 'https://i.ibb.co/CP9393X/BTC.png',
        'DCC': 'https://i.ibb.co/Z6hz0Dq/deficonnectcredit1.png',
        'USDT': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
        'USDC.e': 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694'
      };

      // Create the ETH token object
      const ethToken = {
        "name": "Ether",
        "symbol": "ETH",
        "address": "ETH",
        "decimals": 18,
        "chainId": 66665,
        "logoURI": "https://i.ibb.co/rGJ8WyX/eth-logo.png"
      };

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Process each token in the items array
        let updatedItems = data.items.map(token => {
          // Add chainId to all tokens
          const updatedToken = {
            ...token,
            chainId: 66665
          };

          // Rename logo_url to logoURI if it exists
          if (updatedToken.logo_url) {
            updatedToken.logoURI = updatedToken.logo_url;
            delete updatedToken.logo_url;
          }

          // Update logoURI for tokens in our map
          if (token.symbol in tokenIconMap) {
            updatedToken.logoURI = tokenIconMap[token.symbol];
          }
          // Add fallback logo for tokens without logoURI
          else if (!updatedToken.logoURI) {
            updatedToken.logoURI = "/creator.png";
          }

          return updatedToken;
        });

        // Add ETH token if it doesn't already exist in the list
        const ethExists = updatedItems.some(token => token.symbol === "ETH");
        if (!ethExists) {
          updatedItems.unshift(ethToken);
        }

        setTokens(updatedItems);
      } catch (error) {
        console.error('Error processing token list:', error);
        // If API fetch fails, still ensure ETH is in the list
        const fallbackList = tokenList || [];
        const ethExists = fallbackList.some(token => token.symbol === "ETH");
        if (!ethExists) {
          fallbackList.unshift(ethToken);
        }
        setTokens(fallbackList);
      }
    }

    fetchAndUpdateTokenList();
  }, [tokenList]);

  const filteredTokens = useMemo(() => {
    if (!searchQuery) {
      // Sort the tokens in the following order:
      // 1. Priority tokens (ETH, DCC)
      // 2. Tokens with balance
      // 3. Tokens with logos
      // 4. Rest of the tokens
      return [...tokens].sort((a, b) => {
        // First, check if tokens are in the priority list (ETH, DCC)
        const aIsPriority = a.symbol === "ETH" || a.symbol === "DCC";
        const bIsPriority = b.symbol === "ETH" || b.symbol === "DCC";

        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;

        // If both are priority tokens, ETH comes first
        if (aIsPriority && bIsPriority) {
          return a.symbol === "ETH" ? -1 : 1;
        }

        // Next, check if tokens have balance
        const aBalance = parseFloat(a.data?.formatted || 0);
        const bBalance = parseFloat(b.data?.formatted || 0);
        const aHasBalance = aBalance > 0;
        const bHasBalance = bBalance > 0;

        if (aHasBalance && !bHasBalance) return -1;
        if (!aHasBalance && bHasBalance) return 1;

        // If both have balance, sort by balance amount (descending)
        if (aHasBalance && bHasBalance) {
          return bBalance - aBalance;
        }

        // Next, check if tokens have custom logos (not fallback)
        const aHasCustomLogo = a.logoURI && a.logoURI !== "/creator.png";
        const bHasCustomLogo = b.logoURI && b.logoURI !== "/creator.png";

        if (aHasCustomLogo && !bHasCustomLogo) return -1;
        if (!aHasCustomLogo && bHasCustomLogo) return 1;

        // Finally, sort alphabetically by symbol
        return a.symbol.localeCompare(b.symbol);
      });
    }

    // If there's a search query, filter by it
    const query = searchQuery.toLowerCase();
    return tokens.filter(token =>
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery, tokensWithBalances]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-[hsla(0,0%,0%,0.7)]"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] rounded-2xl bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-4 sm:p-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold">Select a Token</h2>
            <RxCross1
              className="text-white h-10 w-10 cursor-pointer hover:bg-[hsla(213,20%,65%,0.1)] rounded-lg p-2"
              onClick={onClose}
            />
          </div>

          <div className="relative mb-4">
            <input
              className="w-full bg-inherit border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-1 sm:p-2"
              type="text"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <IoSearchOutline className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {filteredTokens.map((token) => (
                <TokenWithBalance
                  key={token.address}
                  token={token}
                  address={address}
                  onSelect={onSelect}
                  onClose={onClose}
                />
              ))}

              {filteredTokens.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  {address ? `No tokens found matching "{searchQuery}"` : "Connect Wallet" }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTokenModal;