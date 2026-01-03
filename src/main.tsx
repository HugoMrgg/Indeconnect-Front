import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/provider/AuthProvider";
import { UIProvider } from "@/context/UIContext";
import { CartUIProvider } from "@/context/provider/CartUIProvider";
import { AppWithCartModal } from "@/features/cart/AppWithCartModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initSentry } from "@/utils/sentry";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Initialiser Sentry le plus tôt possible
initSentry();

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
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
                                    <ReactQueryDevtools initialIsOpen={false} />
                                </CartUIProvider>
                            </UIProvider>
                        </AuthProvider>
                    </BrowserRouter>
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
