import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "@/routes/AppRouter";
import { UIProvider } from "@/context/UIContext";
import "./App.css";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <UIProvider>
                    <AppRouter />
                </UIProvider>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
