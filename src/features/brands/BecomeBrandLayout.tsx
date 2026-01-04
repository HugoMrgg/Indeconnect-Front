import React from "react";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

interface Props {
    children: React.ReactNode;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export const BecomeBrandPageLayout: React.FC<Props> = ({ children, searchQuery, onSearchChange }) => (
    <main className="relative bg-white min-h-screen mx-auto pb-16">
        {children}
        <AuthPanel />
        <NavBar searchValue={searchQuery} onSearchChange={onSearchChange} />
    </main>
);
