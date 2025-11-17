import React from "react";
import { BrandCard } from "./BrandCard";
import {Brand} from "@/types/brand";


interface BrandSectionProps {
    title: string;
    brands: Brand[];
}

export const BrandSection: React.FC<BrandSectionProps> = ({ title, brands }) => {
    return (
        <section className="my-10 px-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-white to-transparent" />

                <div className="flex gap-4 overflow-x-auto pb-2 pt-2 scrollbar-thin-horizontal">
                    {brands.map((b, i) => (
                        <BrandCard key={i} {...b} />
                    ))}
                </div>
            </div>
        </section>
    );
};