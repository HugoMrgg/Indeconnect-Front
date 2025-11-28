import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { UIProvider } from "@/context/UIContext";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DevResetAuth } from "../tests/resetAuth";
import { CartUIProvider } from "@/context/provider/CartUIProvider";
import { AppWithCartModal } from "@/features/cart/AppWithCartModal";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <UIProvider>
                    <CartUIProvider>
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                duration: 5000,
                                style: { fontSize: "15px" }
                            }}
                        />
                        <DevResetAuth />
                        <AppWithCartModal />
                    </CartUIProvider>
                </UIProvider>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
