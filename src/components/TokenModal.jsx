import { useState, useContext, useMemo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { AppDataContext } from "../context/appContext";

const SelectTokenModal = ({
  isOpen,
  onClose,
  onSelect,
  setAddCustomToken,
  isDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tokenList } = useContext(AppDataContext);

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokenList;
    
    const query = searchQuery.toLowerCase();
    return tokenList.filter(token => 
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  }, [tokenList, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-[hsla(0,0%,0%,0.7)]"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] rounded-2xl bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-4 sm:p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold">Select a Token</h2>
          {/* <h2
            className="text-[#854CFF] cursor-pointer hover:underline hidden sm:block text-sm sm:text-md"
            onClick={() => {
              setAddCustomToken(true);
              onClose();
            }}
          >
            + Add Custom Token
          </h2> */}
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
              <div
                key={token.address}
                className="flex justify-between items-center border-2 border-gray-300 rounded-lg p-2 sm:p-3 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={token.logoURI}
                    alt={`${token.symbol} logo`}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{token.symbol}</p>
                    <p className="text-sm text-gray-500">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{token.chainId}</p>
                  <p className="text-xs text-gray-500">{token.decimals} decimals</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RxCross1
          className="absolute top-[-40px] right-[-40px] text-white h-10 w-10 cursor-pointer hover:bg-[hsla(213,20%,65%,0.1)] rounded-lg p-2 hidden sm:block"
          onClick={onClose}
        />
      </div>
    </div>
  );
};


export default SelectTokenModal