import React, { useState} from 'react';
import { FaSearch, FaArrowRight, FaSpinner } from 'react-icons/fa';

const DomainSearch = ({ 
  placeholder = "Search..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        setSearchTerm('');
      } catch (err) {
        console.error('Error analyzing search term:', err);
      }
    }
  };

  return (
    <div 
      className="relative"
    >
      
      <div className={`flex items-center transition-all duration-300 glassmorphic rounded-full shadow-md overflow-hidden w-64 pl-4 pr-2 py-2`}>
        
        <form onSubmit={handleSubmit} className="flex w-full items-center">
            <FaSearch size={18} className="text-gray-500 dark:text-white mr-2" />
            <input
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
      </div>
    </div>
  );
};

export default DomainSearch;