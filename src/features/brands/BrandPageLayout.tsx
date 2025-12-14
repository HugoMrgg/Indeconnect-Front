import React from "react";
import { Banner } from "@/features/banners/Banner";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

interface Props {
    children: React.ReactNode;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

// Wrapper qui fournit la structure commune (Banner, AuthPanel, NavBar)
export const BrandPageLayout: React.FC<Props> = ({ children, searchQuery, onSearchChange }) => (
    <main className="relative bg-white min-h-screen mx-auto pb-16">
        <Banner />
        {children}
        <AuthPanel />
        <NavBar scope={"products"} searchValue={searchQuery} onSearchChange={onSearchChange} />
    </main>
);
