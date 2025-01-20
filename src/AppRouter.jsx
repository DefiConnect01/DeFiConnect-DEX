import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import TransactionHistory from './components/TransactionHistory';
import TransactionMenu from './components/TransactionMenu';
import LiquidityMenu from './components/LiquidityMenu';

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
                        <LiquidityMenu />
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