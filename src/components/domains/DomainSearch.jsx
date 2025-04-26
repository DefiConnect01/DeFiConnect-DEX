import React, { useContext, useState } from 'react';
import { FaSearch, FaArrowRight, FaSpinner } from 'react-icons/fa';
import {ZNSContext} from '../../context/znsContext';
import DomainSuccessModal from '../modal/DomainSuccessModal';


const DomainSearch = ({ placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  const {
     domains, 
     isLoading, 
      error, 
      registerDomain

  } = useContext(ZNSContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const domainName = searchTerm.trim();
    if (domainName) {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Domain search submitted: ${searchTerm}`);
        await registerDomain(domainName, 'ceo').then(() => {
          setModalOpen(true);
        });
        
      } catch (err) {
        console.error('Error analyzing search term:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const isButtonDisabled = !searchTerm.trim() || loading;
  
  return (
    <>
    <DomainSuccessModal domainName={searchTerm} open={modalOpen} onClose={() => {
      setModalOpen(false);
      setSearchTerm('');
    }} />
    <div className="relative">
      <div className="flex items-center transition-all duration-300 glassmorphic rounded-full shadow-md overflow-hidden w-96 pl-4 pr-2 py-2">
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
            className={`ml-2 px-3 py-2 flex items-center justify-center rounded-full transition-colors text-sm ${
              !isButtonDisabled
                ? 'bg-primary/80 text-white hover:bg-primary' 
                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
            }`}
            disabled={isButtonDisabled}
          >
            {loading ? (
              <FaSpinner size={16} className="animate-spin" />
            ) : (
              "Register Domain"
            )}
          </button>
        </form>
      </div>
    {/* </div> */}


  <div className="mt-2 text-sm">
  {/* {domains && (
    <p className="text-green-500">Successfully registered: {domains}</p>
  )}
  {error && (
    <p className="text-red-500">Error: {error}</p>
  )} */}
  </div>
  </div>
  </>
  );
}

export default DomainSearch;