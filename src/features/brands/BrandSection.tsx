import React from "react";
import { BrandCard } from "./BrandCard";
import {Brand} from "../../types/brand";


interface BrandSectionProps {
    title: string;
    brands: Brand[];
}

export const BrandSection: React.FC<BrandSectionProps> = ({ title, brands }) => {
    return (
        <section className="my-10 px-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="flex gap-4 flex-wrap">
                {brands.map((b, i) => (
                    <BrandCard key={i} {...b} />
                ))}
            </div>
        </section>
    );
};