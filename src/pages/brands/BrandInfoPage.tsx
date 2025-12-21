import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useBrands } from "@/hooks/Brand/useBrands";
import { useBrandDetail } from "@/hooks/Brand/useBrandDetail";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { BrandLoading } from "@/features/brands/BrandLoading";
import { BrandError } from "@/features/brands/BrandError";
import { BrandInfoContent } from "@/features/brands/BrandInfoContent";

export const BrandInfoPage: React.FC = () => {
    const { brandName } = useParams();
    const decodedBrand = brandName ? decodeURIComponent(brandName) : "";

    const { brands, loading: listLoading, error: listError } = useBrands();

    const summary = useMemo(
        () => brands.find((b) => b.name === decodedBrand),
        [brands, decodedBrand]
    );

    const { brand, loading: loadingDetail, error: detailError } = useBrandDetail(summary?.id ?? null);

    if (listLoading || loadingDetail) {
        return (
            <BrandLoading
                name={brand?.name || decodedBrand}
                bannerUrl={brand?.bannerUrl || summary?.bannerUrl || null}
            />
        );
    }

    if (listError || detailError || !summary || !brand) {
        return (
            <BrandError
                name={decodedBrand}
                message={listError || detailError || "Marque introuvable"}
                bannerUrl={summary?.bannerUrl || null}
            />
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white">
            <BannerBrand name={brand.name} bannerUrl={brand.bannerUrl} />

            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 -mt-10 relative">
                <BrandInfoContent
                    brand={{
                        name: brand.name,
                        logoUrl: brand.logoUrl,
                        bannerUrl: brand.bannerUrl,
                        description: brand.description,
                        aboutUs: brand.aboutUs,
                        whereAreWe: brand.whereAreWe,
                        otherInfo: brand.otherInfo,
                        contact: brand.contact,
                        priceRange: brand.priceRange,
                    }}
                    editMode={false}
                />
            </main>
        </div>
    );
};
