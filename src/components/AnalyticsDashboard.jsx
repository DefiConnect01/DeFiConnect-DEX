import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data
  const dexData = {
    tvl: 1550000,
    tvlChange: 2.49,
    volume24h: 2190,
    fees24h: 21.87,
    date: "Jul 28, 2025 (UTC)"
  };
  
  const topTokens = [
    { id: 1, name: "Ethereum (ETH)", price: 3700, priceChange: 2.16, volume24h: 4470, tvl: 735380 },
    { id: 2, name: "DefiConnect Token (DCC)", price: 0.000062, priceChange: 2.89, volume24h: 4990, tvl: 775120 },
    { id: 3, name: "Wrapped U2U(WU2U)", price: 0.0062, priceChange: 2.89, volume24h: 4990, tvl: 775120 },
    
    
  ];
  
  const topPairs = [
    { id: 1, pair: "DCC/USDT", tvl: 147000000, volume24h: 65000, volume7d: 171600 },
    { id: 2, pair: "DCC/ETH", tvl: 147000000, volume24h: 5000, volume7d: 171600 },
    { id: 3, pair: "DCC/pUSDT", tvl: 70690, volume24h: 3000.34, volume7d: 6430 },
    { id: 4, pair: "DCC/U2U", tvl: 147000000, volume24h: 4470, volume7d: 171600 },
    { id: 5, pair: "U2U/pUSDT", tvl: 70690, volume24h: 496.34, volume7d: 6430 },
   
  ];
  
  // Chart data
  const volumeData = [2800, 2000, 1400, 7000, 0, 800, 1400, 2000, 2600, 100, 700, 1300, 1800, 2400, 3000, 600, 1100, 1600, 2200, 2800];
  const maxVolume = Math.max(...volumeData);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="py-16 px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
         
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Where DeFi meets innovation
          </p>
          
          <div className="mt-12">
            <button 
              onClick={() => navigate('/trade')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity text-lg shadow-lg"
            >
              Start Trading
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Stats Cards */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* TVL Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Value Locked</h2>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">${(dexData.tvl / 1000000).toFixed(2)}M</span>
              <span className="ml-3 text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {dexData.tvlChange}%
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{dexData.date}</p>
          </motion.div>
          
          {/* Volume Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Volume 24H</h2>
            <div className="mt-4">
              <p className="text-3xl font-bold">${dexData.volume24h.toLocaleString()}</p>
            </div>
          </motion.div>
          
          {/* Fees Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Fees 24H</h2>
            <div className="mt-4">
              <p className="text-3xl font-bold">${dexData.fees24h.toLocaleString()}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Chart Section */}
        <motion.div 
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Volume (24H)</h2>
            <span className="text-gray-500 dark:text-gray-400">${maxVolume.toLocaleString()}</span>
          </div>
          <div className="h-64 flex items-end space-x-1">
            {volumeData.map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxVolume) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
                className={`w-3 rounded-t ${
                  value === maxVolume 
                    ? 'bg-gradient-to-t from-purple-600 to-purple-400' 
                    : 'bg-gradient-to-t from-blue-500 to-blue-300'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
            {['08', '14', '20', '26', '01', '07', '13', '18', '24', '30', '06', '11', '16', '22', '28'].map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
        </motion.div>
        
        {/* Top Tokens and Pairs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Top Tokens */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Top Tokens</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">NO.</th>
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">Price</th>
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {topTokens.map(token => (
                    <tr key={token.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4">{token.id}</td>
                      <td className="py-4 font-medium">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-3"></div>
                          {token.name}
                        </div>
                      </td>
                      <td className="py-4">${token.price.toFixed(token.price < 1 ? 4 : 2)}</td>
                      <td className={`py-4 ${token.priceChange > 0 ? 'text-green-500' : token.priceChange < 0 ? 'text-red-500' : ''}`}>
                        {token.priceChange > 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-6 text-gray-500 dark:text-gray-400">
              <span>Page 1 of 1</span>
            </div>
          </motion.div>
          
          {/* Top Pairs */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Top Pairs</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">NO.</th>
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">Pair</th>
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">TVL</th>
                    <th className="pb-4 font-medium text-gray-500 dark:text-gray-400">Volume 24H</th>
                  </tr>
                </thead>
                <tbody>
                  {topPairs.map(pair => (
                    <tr key={pair.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4">{pair.id}</td>
                      <td className="py-4 font-medium">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500"></div>
                          </div>
                          <span className="ml-2">{pair.pair}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        {pair.tvl > 1000000 
                          ? `$${(pair.tvl / 1000000).toFixed(2)}M` 
                          : `$${(pair.tvl / 1000).toFixed(2)}K`}
                      </td>
                      <td className="py-4">${pair.volume24h.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-400">
              <span>Page 1 of 1</span>
              <button className="flex items-center text-blue-500">
                Next <span className="ml-1">→</span>
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Platform Stats */}
        <motion.div 
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold mb-6">Platform Stats</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">12,458</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">1.2M</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$0.85</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Avg. Fee</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">84</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Active Pairs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">+142</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">New Users (24h)</p>
            </div>
          </div>
        </motion.div>
        
        {/* Latest Updates */}
        <motion.div 
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className="text-xl font-bold mb-6">Latest Updates</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 p-6 rounded-xl border border-purple-100 dark:border-gray-700">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-lg">Stake Pool launch</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">August 5, 2025</p>
                  <p className="mt-3">We're excited to announce the  launch of Stake Pool on Base Chain, putting your $DCC token into working for you.</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-900 p-6 rounded-xl border border-green-100 dark:border-gray-700">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                  U
                </div>
                <div>
                  <h3 className="font-bold text-lg">Testnet Campaign on U2U Network</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">August  10, 2025</p>
                  <p className="mt-3">We're excited to announce The Upcoming Testnet Campaign on U2U Network .</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;


