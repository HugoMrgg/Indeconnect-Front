import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "@/routes/AppRouter";
import { Toaster } from "react-hot-toast";
import { UIProvider } from "@/context/UIContext";
import "./App.css";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/context/AuthContext";
import {DevResetAuth} from "../tests/resetAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <UIProvider>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 5000,
                            style: { fontSize: "15px" }
                        }}
                    />
                    <DevResetAuth/>
                    <AppRouter />
                </UIProvider>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
