import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import TransactionInterface from './components/TransactionInterface';
import TransactionHistory from './components/TransactionHistory';
import TransactionMenu from './components/TransactionMenu';
import LiquidityMenu from './components/LiquidityMenu'

;
import LiquidityPage from './components/LiquidityPage';

function AppRouter() {
    // console.log("Rendering AppRouter");
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<>
                        <TransactionMenu/>
                    </>} />
                    <Route path="liquidity" element={<>
                        <LiquidityPage />
                        {/* <LiquidityMenu /> */}
                    </>} />
                    <Route path="transactions" element={<>
                        <TransactionHistory />
                    </>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default AppRouter;