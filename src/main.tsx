import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/provider/AuthProvider";
import { UIProvider } from "@/context/UIContext";
import { CartUIProvider } from "@/context/provider/CartUIProvider";
import { AppWithCartModal } from "@/features/cart/AppWithCartModal";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
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
    </React.StrictMode>
);
