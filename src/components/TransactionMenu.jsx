import React from 'react'
import TransactionInterface from './TransactionInterface';
import PoolTable from './PoolTable';
// import VestTable from './lock/VestTable';
// import LoanTable from './loan/LoanTable';
import TransactionChain from './cross-chain/TransactionChain';
import DomainTable from './domains/DomainTable';
import TransactionStake from './stake/TransactionStake';

function TransactionMenu() {

    const [activeTab, setActiveTab] = React.useState("swap");

    const handleActive = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="w-[95vw] max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-5 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-8">
                <div className="me-2">
                    <button onClick={() => handleActive("swap")} aria-current="page" className={`w-full inline-block p-4 ${activeTab === "swap" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"} 
                         rounded-t-lg active`}>
                        Swap
                    </button>
                </div>
                <div className="me-2">
                    <button onClick={() => handleActive("stake")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "stake" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Stake</button>
                </div>
                <div className="me-2">
                    <button onClick={() => handleActive("liquidity")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "liquidity" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Liquidity</button>
                </div>
                {/* <div className="me-2">
                    <button onClick={() => handleActive("lock")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "lock" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Lock</button>
                </div> */}
                {/* <div className="me-2">
                    <button onClick={() => handleActive("vote")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "vote" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Vote</button>
                </div> */}
                {/* <div className="me-2">
                    <button onClick={() => handleActive("loan")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "loan" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Loan</button>
                </div> */}
                <div className="me-2">
                    <button onClick={() => handleActive("cross-chain")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "cross-chain" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Cross Chain</button>
                </div>
                {/* <div className="me-2">
                    <button onClick={() => handleActive("reward")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "reward" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"}`}>Reward</button>
                </div> */}
                <div className="me-2">
                    <button onClick={() => handleActive("domains")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "domains" ?
                        "dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300  dark:hover:bg-darkModeGray"}`}>Domains</button>
                </div>
            </div>

            <div className='min-h-[650px]'>
                {activeTab === "swap" && (
                    <>
                        <TransactionInterface/>
                    </>
                )}

                {activeTab === "stake" && (
                    <>
                        <TransactionStake/>
                    </>
                )}

                {activeTab === "liquidity" && (
                    <>
                        <PoolTable/>
                    </>
                )}

                {/* {activeTab === "lock" && (
                    <>
                        <VestTable/>
                    </>
                )}

                {activeTab === "loan" && (
                    <>
                        <LoanTable/>
                    </>
                )} */}

                {activeTab === "cross-chain" && (
                    <>
                        <TransactionChain/>
                    </>
                )}

                {activeTab === "domains" && (
                    <>
                        <DomainTable/>
                    </>
                )}
            </div>
        </>
    )
}

export default TransactionMenu