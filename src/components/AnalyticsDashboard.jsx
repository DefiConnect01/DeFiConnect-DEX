import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnalyticsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from an API
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* <div className="w-10 h-10 rounded-full bg-gradient-to-r from-grren-600 to-blue-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold">D</span>
            </div> */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text">
              DeFi Connect Info & Analytics
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => navigate('/trade')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Trade
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Dashboard */}
      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* TVL Card */}
            <div className={`rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all hover:shadow-2xl`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-400">Total Value Locked</h2>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold">${(dexData.tvl / 1000000).toFixed(2)}M</span>
                    <span className="ml-3 text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {dexData.tvlChange}%
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1 text-sm">{dexData.date}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Live
                </div>
              </div>
              
              {/* Volume & Fees */}
              <div className="flex mt-8 space-x-8">
                <div>
                  <p className="text-gray-400">Volume 24H</p>
                  <p className="text-xl font-bold mt-1">${dexData.volume24h.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fees 24H</p>
                  <p className="text-xl font-bold mt-1">${dexData.fees24h.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Volume Chart */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Volume (24H)</span>
                  <span>${maxVolume.toLocaleString()}</span>
                </div>
                <div className="h-40 flex items-end space-x-1">
                  {volumeData.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / maxVolume) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.03 }}
                      className={`w-4 rounded-t ${
                        value === maxVolume 
                          ? 'bg-gradient-to-t from-purple-600 to-purple-400' 
                          : darkMode 
                            ? 'bg-gray-700' 
                            : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {['08', '14', '20', '26', '01', '07', '13', '18', '24', '30', '06', '11', '16', '22', '28'].map((day, i) => (
                    <span key={i}>{day}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Top Tokens Card */}
            <div className={`rounded-2xl p-6 mt-8 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Top Tokens</h2>
                <button className="text-sm text-blue-500 hover:underline">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
                      <th className="pb-4 font-medium">NO.</th>
                      <th className="pb-4 font-medium">Name</th>
                      <th className="pb-4 font-medium">Price</th>
                      <th className="pb-4 font-medium">Price Change</th>
                      <th className="pb-4 font-medium">Volume 24H</th>
                      <th className="pb-4 font-medium">TVL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTokens.map(token => (
                      <tr key={token.id} className="border-t border-gray-200 dark:border-gray-700">
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
                        <td className="py-4">${token.volume24h.toLocaleString()}</td>
                        <td className="py-4">${(token.tvl / 1000).toFixed(2)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-center mt-6 text-gray-500">
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* Top Pairs Card */}
            <div className={`rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Top Pairs</h2>
                <button className="text-sm text-blue-500 hover:underline">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
                      <th className="pb-4 font-medium">NO.</th>
                      <th className="pb-4 font-medium">Pair</th>
                      <th className="pb-4 font-medium">TVL</th>
                      <th className="pb-4 font-medium">Volume 24H</th>
                      <th className="pb-4 font-medium">Volume 7D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPairs.map(pair => (
                      <tr key={pair.id} className="border-t border-gray-200 dark:border-gray-700">
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
                        <td className="py-4">${pair.volume7d.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6 text-gray-500">
                <span>Page 1 of 1</span>
                <button className="flex items-center text-blue-500">
                  Next <span className="ml-1">→</span>
                </button>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className={`rounded-2xl p-6 mt-8 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-6">Platform Stats</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Users</span>
                  <span className="font-medium">12,458</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transactions</span>
                  <span className="font-medium">1.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg. Fee</span>
                  <span className="font-medium">$0.85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Pairs</span>
                  <span className="font-medium">84</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Users (24h)</span>
                  <span className="font-medium text-green-500">+142</span>
                </div>
              </div>
            </div>
            
            {/* News Card */}
            <div className={`rounded-2xl p-6 mt-8 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Latest Updates</h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      S
                    </div>
                    <div>
                      <h3 className="font-medium">Stake Pool launch</h3>
                      <p className="text-sm text-gray-500 mt-1">August 04, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-teal-500 flex items-center justify-center text-white font-bold mr-3">
                      U
                    </div>
                    <div>
                      <h3 className="font-medium">U2U Testnet Campaign</h3>
                      <p className="text-sm text-gray-500 mt-1">August 10, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                View All Updates
              </button>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default AnalyticsDashboard;


