import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Search submitted:', searchTerm);
      setSearchTerm('');
      setIsExpanded(false);
    }
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
    >
      <div className={`flex items-center transition-all duration-300 glassmorphic rounded-full shadow-md overflow-hidden ${
        isExpanded ? 'w-64 pl-4 pr-2 py-2' : 'w-12 h-12 justify-center'
      }`}>
        
        {!isExpanded ? (
          <button 
            className="flex items-center justify-center w-full h-full text-gray-600 dark:text-white hover:text-gray-800"
            onClick={() => setIsExpanded(true)}
          >
            <FaSearch size={20} />
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full items-center">
            <FaSearch size={18} className="text-gray-500 dark:text-white mr-2" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="flex-1 outline-none  bg-transparent"
            />
            <button 
              type="submit"
              className={`ml-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                searchTerm.trim() 
                  ? 'bg-primary/80 text-white hover:bg-primary' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!searchTerm.trim()}
            >
              <FaArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SearchBar;