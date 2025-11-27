import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUI } from "@/context/UIContext";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { FiltersPanel } from "@/features/filters/FiltersPanel";
import { useProducts } from "@/hooks/useProducts";
import { useBrands } from "@/hooks/useBrands";
import { useProductFilters } from "@/hooks/useProductFilters";
import { BrandHeader } from "@/features/brands/BrandHeader";
import { BackToBrands } from "@/features/brands/BackToBrands";
import { BrandProducts } from "@/features/brands/BrandProducts";
import { BrandLoading } from "@/features/brands/BrandLoading";
import { BrandError } from "@/features/brands/BrandError";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

export const BrandPage: React.FC = () => {
    const { brandName } = useParams();
    const decodedBrand = decodeURIComponent(brandName ?? "");

    const { setScope, filtersOpen, closeFilters } = useUI();
    useEffect(() => {
        setScope("products");
        return () => closeFilters();
    }, [setScope, closeFilters]);

    const { brands, loading: brandsLoading, error: brandsError } = useBrands();
    const brand = brands.find(b => b.name === decodedBrand);

    const { products, loading, error } = useProducts(brand?.id || null, decodedBrand);

    const filter = useProductFilters(products);

    if (loading || brandsLoading) {
        return <BrandLoading name={decodedBrand} bannerUrl={brand?.bannerUrl} />;
    }

    if (error || brandsError) {
        return <BrandError
            name={decodedBrand}
            message={error || brandsError || ''}
            bannerUrl={brand?.bannerUrl}
        />;
    }

    return (
        <div className="min-h-full bg-white">
            <BannerBrand name={decodedBrand} bannerUrl={brand?.bannerUrl} />

            <main className="mx-auto max-w-6xl px-4 pb-16">
                <BrandHeader brand={brand} />

                <BackToBrands />

                <FiltersPanel
                    open={filtersOpen}
                    onClose={closeFilters}
                    onReset={filter.resetAll}
                    resetKey={filter.resetKey}
                    onChangePrice={filter.handlePrice}
                    onChangeCategories={filter.handleCategories}
                    onChangeSizes={filter.handleSizes}
                    onChangeColors={filter.handleColors}
                    onChangeEthics={filter.handleEthics}
                    selectedCategories={filter.categories}
                    selectedSizes={filter.sizes}
                    selectedColors={filter.colors}
                    selectedEthics={filter.ethics}
                    colorsAvailable={filter.availableColors}
                    ethicsAvailable={filter.availableEthics}
                />

                <BrandProducts filter={filter} />
            </main>

            <AuthPanel />
            <NavBar />
        </div>
    );
};
