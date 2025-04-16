import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaArrowRight, FaSpinner } from 'react-icons/fa';
import useOpenAIAnalysis from '../../hooks/useOpenAIAnalysis';

const SearchBar = ({ 
  parameterFormat, 
  onAnalysisComplete, 
  model = "gpt-3.5-turbo",
  temperature = 0.2,
  placeholder = "Search..."
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENAI_KEY;

  // Initialize the OpenAI analysis hook
  const { analyzeText, loading, error } = useOpenAIAnalysis({
    apiKey,
    model,
    temperature
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        // Analyze the search term with OpenAI
        const result = await analyzeText(searchTerm, parameterFormat);
        
        // Call the callback with the analysis result and the original search term
        if (result && onAnalysisComplete) {
          onAnalysisComplete(result, searchTerm);
        }
        
        // Reset search field after submission
        setSearchTerm('');
        setIsExpanded(false);
      } catch (err) {
        console.error('Error analyzing search term:', err);
      }
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
      {error && (
        <div className="absolute -top-12 left-0 right-0 bg-red-100 text-red-800 p-2 rounded-md text-sm">
          {error.message}
        </div>
      )}
      
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
              placeholder={placeholder}
              className="flex-1 outline-none bg-transparent"
              disabled={loading}
            />
            <button 
              type="submit"
              className={`ml-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                searchTerm.trim() && !loading
                  ? 'bg-primary/80 text-white hover:bg-primary' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!searchTerm.trim() || loading}
            >
              {loading ? (
                <FaSpinner size={16} className="animate-spin" />
              ) : (
                <FaArrowRight size={16} />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SearchBar;