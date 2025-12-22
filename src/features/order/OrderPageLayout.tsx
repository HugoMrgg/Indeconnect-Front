import React from "react";
import { Banner } from "@/features/banners/Banner";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

interface Props {
    children: React.ReactNode;
}

/**
 * Layout commun pour les pages de commandes
 * Fournit la structure avec Banner, AuthPanel et NavBar
 */
export const OrderPageLayout: React.FC<Props> = ({ children }) => (
    <main className="relative bg-gray-50 min-h-screen mx-auto pb-20">
        <Banner />
        {children}
        <AuthPanel />
        <NavBar />
    </main>
);
