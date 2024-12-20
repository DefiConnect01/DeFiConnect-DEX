import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";

import AppKitProvider  from "./context/wagmi";
import AppContext from "./context/appContext";
import ToastProvider from "./components/shared/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppKitProvider>

      <AppContext>      <ToastProvider /> 

        <AppRouter />
      </AppContext>
    </AppKitProvider>
  </React.StrictMode>
);
