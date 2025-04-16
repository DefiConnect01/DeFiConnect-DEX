import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";

import AppKitProvider  from "./context/wagmi";
import AppContext from "./context/appContext";
import ToastProvider from "./components/shared/ToastProvider";
import ZNSProvider from "./context/znsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppKitProvider>

      <AppContext>  
        <ZNSProvider > 
         <ToastProvider /> 

        <AppRouter />
        </ZNSProvider>
      </AppContext>
    </AppKitProvider>
  </React.StrictMode>
);
