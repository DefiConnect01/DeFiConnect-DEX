import React from 'react'
import TransactionLiquidity from './TransactionLiquidity';
import WithdrawLiquidity from './WithdrawLiquidity';
import NavigateButton from './shared/NavigateButton';
import { GiReturnArrow } from "react-icons/gi";

function TransactionMenu() {

    const [activeTab, setActiveTab] = React.useState("deposit");

    const handleActive = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="flex justify-start mb-4 ml-6">
                <NavigateButton text="Back" link="/" icon={<GiReturnArrow />}/>
            </div>

            <div className="w-[95vw] max-w-[450px] mx-auto grid grid-cols-2 text-sm font-medium text-center border-b text-gray-500 border-gray-200 dark:border-gray-700 ">
                <div className="me-2">
                    <button onClick={() => handleActive("deposit")} aria-current="page" className={`w-full inline-block p-4 ${activeTab === "deposit" ?
                        "text-lightText dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"} 
                         rounded-t-lg active`}>
                        Deposit
                    </button>
                </div>
                <div className="me-2">
                    <button onClick={() => handleActive("withdraw")} className={`w-full inline-block p-4 rounded-t-lg ${activeTab === "withdraw" ?
                        "text-lightText dark:text-white dark:glassmorphic active glassmorphic-dark dark:hover:glassmorphic" : 
                        "hover:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-darkModeGray"} `}>Withdraw</button>
                </div>
            </div>

            <div className='min-h-[650px]'>
                {activeTab === "deposit" && (
                    <>
                        <TransactionLiquidity/>
                    </>
                )}

                {activeTab === "withdraw" && (
                    <div>
                        <WithdrawLiquidity/>
                    </div>
                )}
            </div>
        </>
    )
}

export default TransactionMenu