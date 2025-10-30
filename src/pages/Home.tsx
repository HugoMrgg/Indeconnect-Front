import React from "react";
import {Brand} from "../types/brand";
import {Banner} from "../features/banner/components/Banner";
import {FloatingMenu} from "../features/menus/components/FloatingMenu";
import {SearchBar} from "../features/search/components/SearchBar";
import {BrandSection} from "../features/brands/components/BrandSection";
import {UserMenu} from "../features/menus/components/UserMenu";


export const Home: React.FC = () => {
    const brandsNearby: Brand[] = [
        { name: "6K Skateshop", city: "Liège", description: "Please add your content here. Keep it short and simple. And smile :)" },
        { name: "Name", city: "Namur", description: "Something here" },
    ];

    const ethicalBrands: Brand[] = [
        { name: "EcoWear", city: "Bruxelles", description: "Durable fashion" },
    ];

    return (
        <main className="relative bg-white min-h-screen pb-40">
            <Banner />
            <BrandSection title="Marques proches de chez vous :" brands={brandsNearby} />
            <BrandSection title="Marques éthiques :" brands={ethicalBrands} />
            <FloatingMenu />
            <UserMenu />
            <SearchBar />
        </main>
    );
};
