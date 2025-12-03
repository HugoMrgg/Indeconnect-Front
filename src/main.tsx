import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/provider/AuthProvider";
import { UIProvider } from "@/context/UIContext";
import { CartUIProvider } from "@/context/provider/CartUIProvider";
import { AppWithCartModal } from "@/features/cart/AppWithCartModal";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
            <AuthProvider>
                <UIProvider>
                    <CartUIProvider>
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                duration: 5000,
                                style: { fontSize: "15px" },
                            }}
                        />
                        <AppWithCartModal />
                    </CartUIProvider>
                </UIProvider>
            </AuthProvider>
        </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
