import React from "react";
import {Brand} from "../types/brand";
import {Banner} from "../features/banners/Banner";
import {BrandSection} from "../features/brands/BrandSection";
import {NavBar} from "../features/navbar/NavBar";


export const Home: React.FC = () => {
    const brandsNearby: Brand[] = [
        { name: "6K Skateshop", city: "Liège", description: "Please add your content here. Keep it short and simple. And smile :)" },
        { name: "Name", city: "Namur", description: "Something here" },
    ];

    const ethicalBrands: Brand[] = [
        { name: "EcoWear", city: "Bruxelles", description: "Durable fashion" },
    ];

    return (
        <main className="relative bg-white min-h-screen">
            <Banner />
            <div className="w-4/5 mx-auto items-center">{/*mx-20*/}
                <BrandSection title="Marques proches de chez vous :" brands={brandsNearby} />
                <BrandSection title="Marques éthiques :" brands={ethicalBrands} />
                <NavBar />
            </div>
        </main>
    );
};
