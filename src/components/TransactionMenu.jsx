import React from 'react'
import TransactionInterface from './TransactionInterface';
import PoolTable from './PoolTable';

function TransactionMenu() {

    const [activeTab, setActiveTab] = React.useState("swap");

    const handleActive = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="w-[95vw] max-w-[450px] mx-auto grid grid-cols-2 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <div className="me-2">
                    <button onClick={() => handleActive("swap")} aria-current="page" className={`w-full inline-block p-4 ${activeTab === "swap" ?
                        "text-purple dark:text-white bg-gray-100 active dark:bg-darkModeGray" : 
                        "hover:text-gray-600 dark:hover:text-gray-300"} 
                         rounded-t-lg active hover:bg-gray-50 dark:hover:bg-darkModeGray`}>
                        Swap
                    </button>
                </div>
                <div className="me-2">
                    <button onClick={() => handleActive("liquidity")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "liquidity" ?
                        "text-purple dark:text-white bg-gray-100 active dark:bg-darkModeGray" : 
                        "hover:text-gray-600 dark:hover:text-gray-300"} hover:bg-gray-50 dark:hover:bg-darkModeGray`}>Liquidity</button>
                </div>
            </div>

            {activeTab === "swap" && (
                <>
                    <TransactionInterface/>
                </>
            )}

            {activeTab === "liquidity" && (
                <>
                    <PoolTable/>
                </>
            )}
        </>
    )
}

export default TransactionMenu