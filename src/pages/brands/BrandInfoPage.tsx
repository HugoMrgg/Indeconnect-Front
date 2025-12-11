import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useBrands } from "@/hooks/Brand/useBrands";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { BrandLoading } from "@/features/brands/BrandLoading";
import { BrandError } from "@/features/brands/BrandError";
import { BrandDetailDTO } from "@/api/services/brands/types";
import { brandsService } from "@/api/services/brands";
import { BrandInfoContent } from "@/features/brands/BrandInfoContent";

export const BrandInfoPage: React.FC = () => {
    const { brandName } = useParams();
    const decodedBrand = brandName ? decodeURIComponent(brandName) : "";

    const { brands, loading: listLoading, error: listError } = useBrands();

    const [brand, setBrand] = useState<BrandDetailDTO | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const summary = useMemo(
        () => brands.find((b) => b.name === decodedBrand),
        [brands, decodedBrand]
    );

    useEffect(() => {
        const fetchDetail = async () => {
            if (!summary) return;
            try {
                setLoadingDetail(true);
                setDetailError(null);
                const detail = await brandsService.getBrandById(
                    summary.id,
                    undefined,
                    undefined
                );
                setBrand(detail);
            } catch (e) {
                setDetailError(
                    "Impossible de charger les informations détaillées de la marque." + e
                );
            } finally {
                setLoadingDetail(false);
            }
        };

        fetchDetail();
    }, [summary]);

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
