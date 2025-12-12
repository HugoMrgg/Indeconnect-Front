import { BrandInfoPage } from "@/pages/brands/BrandInfoPage";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import React, { useState } from "react";

export function BrandInfoPageWrapper() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-full bg-white">
            <BrandInfoPage />

            <AuthPanel />
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </div>
    );
}
