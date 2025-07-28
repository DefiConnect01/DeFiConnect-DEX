import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import TransactionHistory from './components/TransactionHistory';
import TransactionMenu from './components/TransactionMenu';
import LiquidityMenu from './components/LiquidityMenu';
import TransactionLock from './components/lock/TransactionLock';
// import TransactionBribe from './components/vote/TransactionBribe';
import TransactionLoan from './components/loan/TransactionLoan';
import TransactionChain from './components/cross-chain/TransactionChain';
import DomainTable from './components/domains/DomainTable';
import AnalyticsDashboard from './components/AnalyticsDashboard';

// import ZNSRegister from './components/ZNSRegister';

function AppRouter() {
    return (
        <Router>
            <Routes>
            
                <Route path="/" element={<App />}>

                    <Route path='/' element={<> <AnalyticsDashboard/> </>} />

                    <Route path="/trade" element= {<>
                        <TransactionMenu/>
                    </>} />
                  
                 
               
                    <Route path="liquidity" element={<>
                        <LiquidityMenu />
                    </>} />
                    {/* <Route path="lock" element={<>
                        <TransactionLock />
                    </>} /> */}
                    {/* <Route path="bribe" element={<>
                        <TransactionBribe />
                    </>} /> */}
                    {/* <Route path="loan" element={<>
                        <TransactionLoan />
                    </>} /> */}
                    <Route path="cross-chain" element={<>
                        <TransactionChain />
                    </>} />
                    <Route path="domains" element={<>
                        <DomainTable/>
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