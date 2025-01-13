import React, { useState } from 'react';
import tokenList from "../constants/tokenList.json";
import stores from '../stores';
import { ACTIONS } from '../stores/constants/constants';

const LiquidityPage = () => {
    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");
    const [depositLoading, setDepositLoading] = useState(false);


    // const token0 = tokenList[0];
    const token0 = tokenList[0]
    const token1 = tokenList[2];
    // const stable = true;
    const stable = false;
    const slippage = 10;

    // TODO: check balance before sending transaction
    // TOD0: both amouth must be equal

    const onCreateAndDeposit = () => {
        setDepositLoading(true)
        stores.dispatcher.dispatch({
            type: ACTIONS.CREATE_PAIR_AND_DEPOSIT, content: {
                token0: token0,
                token1: token1,
                amount0: amount0,
                amount1: amount1,
                isStable: stable,
                // should be slippage below
                slippage: slippage
            }
        })
    }

    const handleOnclick = () => {
        onCreateAndDeposit()
    }

    return (
        <div className='flex flex-col gap-y-2 items-center justify-center'>
            <div className='flex gap-x-2 '>
                <p>amount 0</p>
                <input 
                    type="text" 
                    placeholder='amount0' 
                    value={amount0} 
                    onChange={(e) => setAmount0(e.target.value)} 
                    className='text-gray-900' 
                />
            </div>
            <div className='flex gap-x-2 '>
                <p>amount 1</p>
                <input 
                    type="text" 
                    placeholder='amount1' 
                    value={amount1} 
                    onChange={(e) => setAmount1(e.target.value)} 
                    className='text-gray-900' 
                />
            </div>
            <button 
                type="button" 
                className='px-4 py-1 rounded-full bg-rose-500 hover:bg-rose-500/90'
                onClick={handleOnclick}
            >
                Deposit Liquidty
            </button>
            {depositLoading && (
                <p>loading...</p>
            )}
        </div>
    )
}

export default LiquidityPage