import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log('Search submitted:', searchValue);
      // You can replace this with your actual search function
      setSearchValue('');
    }
  };

  return (
    <div className="relative flex items-center justify-end w-64">
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center transition-all duration-300 ease-in-out bg-white rounded-full border border-gray-300 shadow-sm ${
          isExpanded ? 'w-full pl-3 pr-1' : 'w-10 h-10'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !searchValue && setIsExpanded(false)}
      >
        <Search 
          className={`transition-all ${
            isExpanded ? 'w-5 h-5 text-gray-500' : 'w-5 h-5 m-auto text-gray-700'
          }`}
        />
        
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className={`outline-none bg-transparent transition-all ${
            isExpanded ? 'w-full ml-2 py-2' : 'w-0 p-0'
          }`}
        />
        
        <button 
          type="submit" 
          className={`flex items-center justify-center p-2 ml-1 rounded-full bg-blue-500 hover:bg-blue-600 transition-all ${
            isExpanded ? 'opacity-100' : 'opacity-0 w-0 p-0'
          }`}
          disabled={!isExpanded}
        >
          <ArrowRight size={16} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;