import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import TransactionInterface from './components/TransactionInterface';
import TransactionHistory from './components/TransactionHistory';

;

function AppRouter() {
    // console.log("Rendering AppRouter");
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<>
                        <TransactionInterface />
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