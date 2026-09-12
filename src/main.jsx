import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

// Admin Auth Provider
import AuthProvider from "./context/AuthContext";

// Vendor Auth Provider
import { VendorAuthProvider } from "./context/VendorAuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <VendorAuthProvider>
        <App />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </VendorAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);