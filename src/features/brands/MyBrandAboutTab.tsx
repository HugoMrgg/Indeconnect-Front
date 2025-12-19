import React from "react";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { BrandInfoContent } from "@/features/brands/BrandInfoContent";
import { Brand } from "@/types/brand";

interface Deposit {
    city: string | null;
    // autres propriétés du deposit
}

interface MyBrandAboutTabProps {
    brand: Brand;
    mainDeposit: Deposit | null;
    onUpdateField: any;
    onEditDeposit: () => void;
}

export function MyBrandAboutTab({
    brand,
    mainDeposit,
    onUpdateField,
    onEditDeposit,
}: MyBrandAboutTabProps) {
    return (
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white">
            <BannerBrand
                name={brand.name}
                bannerUrl={brand.bannerUrl ?? null}
                editMode={true}
                onUpdate={(url) => onUpdateField("bannerUrl", url)}
            />

            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 -mt-10 relative">
                <BrandInfoContent
                    brand={{
                        name: brand.name,
                        logoUrl: brand.logoUrl ?? null,
                        bannerUrl: brand.bannerUrl ?? null,
                        description: brand.description ?? null,
                        aboutUs: brand.aboutUs ?? null,
                        whereAreWe: brand.whereAreWe ?? null,
                        otherInfo: brand.otherInfo ?? null,
                        contact: brand.contact ?? null,
                        priceRange: brand.priceRange ?? null,
                    }}
                    editMode={true}
                    onUpdateField={onUpdateField}
                    mainDeposit={mainDeposit}
                    onEditDeposit={onEditDeposit}
                />
            </main>
        </div>
    );
}
