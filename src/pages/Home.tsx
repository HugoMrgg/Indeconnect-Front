import React from "react";
import {Banner} from "@/features/banners/Banner";
import {BrandSection} from "@/features/brands/BrandSection";
import {NavBar} from "@/features/navbar/NavBar";
import {useBrands} from "@/hooks/useBrands";


export const Home: React.FC = () => {
    const { brandsNearby, ethicalBrands, loading, error } = useBrands();

    if (loading) {
        return (
            <main className="relative bg-white min-h-screen">
                <Banner />
                <div className="w-4/5 mx-auto items-center">
                    <p className="text-gray-500 animate-pulse">Chargement des marques...</p>
                    <NavBar scope="brands" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="relative bg-white min-h-screen">
                <Banner />
                <div className="w-4/5 mx-auto items-center">
                    <p className="text-red-600">{error}</p>
                    <NavBar scope="brands" />
                </div>
            </main>
        );
    }

    return (
        <main className="relative bg-white min-h-screen">
            <Banner />
            <div className="w-4/5 mx-auto items-center">{/*mx-20*/}
                <BrandSection title="Marques proches de chez vous :" brands={brandsNearby} />
                <BrandSection title="Marques éthiques :" brands={ethicalBrands} />
                <NavBar scope="brands" />
            </div>
        </main>
    );
};
