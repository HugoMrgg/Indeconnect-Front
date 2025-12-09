import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useUI } from "@/context/UIContext";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { FiltersPanel } from "@/features/filters/FiltersPanel";
import { useProducts } from "@/hooks/Product/useProducts";
import { useBrands } from "@/hooks/Brand/useBrands";
import { useProductFilters } from "@/hooks/Product/useProductFilters";
import { BrandHeader } from "@/features/brands/BrandHeader";
import { BackToBrands } from "@/features/brands/BackToBrands";
import { BrandProducts } from "@/features/brands/BrandProducts";
import { BrandLoading } from "@/features/brands/BrandLoading";
import { BrandError } from "@/features/brands/BrandError";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import { Brand, EditableBrandFields } from "@/types/brand";

interface BrandPageProps {
    // Pour MyBrandPage : passer directement le brandId et les données
    brandId?: number;
    brandData?: Brand;
    editMode?: boolean;
    onUpdateField?: <K extends keyof EditableBrandFields>(field: K, value: EditableBrandFields[K]) => void;  // ✅ CHANGÉ
}

export const BrandPage: React.FC<BrandPageProps> = ({
                                                        brandId: propBrandId,
                                                        brandData: propBrandData,
                                                        editMode = false,
                                                        onUpdateField,
                                                    }) => {
    const { brandName } = useParams();
    const decodedBrand = brandName ? decodeURIComponent(brandName) : "";

    const { setScope, filtersOpen, closeFilters } = useUI();
    useEffect(() => {
        setScope("products");
        return () => closeFilters();
    }, [setScope, closeFilters]);

    const { brands, loading: brandsLoading, error: brandsError } = useBrands();

    // Si brandData est fourni en prop, on l'utilise (mode édition)
    // Sinon on le cherche dans la liste (mode public)
    const brand = useMemo(() => {
        if (propBrandData) return propBrandData;

        const foundBrand = brands.find(b => b.name === decodedBrand);
        if (!foundBrand) return undefined;

        return {
            ...foundBrand,
            logoUrl: foundBrand.logoUrl ?? undefined,
            bannerUrl: foundBrand.bannerUrl ?? undefined,
            description: foundBrand.description ?? undefined,
            address: foundBrand.address ?? undefined,
            distanceKm: foundBrand.distanceKm ?? undefined,
        };
    }, [propBrandData, brands, decodedBrand]);

    const activeBrandId = propBrandId || brand?.id || null;
    const { products, loading, error } = useProducts(activeBrandId, decodedBrand);

    const filter = useProductFilters(products);
    const [searchQuery, setSearchQuery] = useState<string>("");

    if (loading || brandsLoading) {
        return <BrandLoading name={brand?.name || decodedBrand} bannerUrl={brand?.bannerUrl} />;
    }

    if (error || brandsError) {
        return (
            <BrandError
                name={brand?.name || decodedBrand}
                message={error || brandsError || ""}
                bannerUrl={brand?.bannerUrl}
            />
        );
    }

    return (
        <div className="min-h-full bg-white">
            <BannerBrand
                name={brand?.name || decodedBrand}
                bannerUrl={brand?.bannerUrl}
                editMode={editMode}
                onUpdate={onUpdateField ? (url) => onUpdateField("bannerUrl", url) : undefined}
            />

            <main className="mx-auto max-w-6xl px-4 pb-16">
                <BrandHeader
                    brand={brand}
                    editMode={editMode}
                    onUpdateField={onUpdateField}
                />

                {!editMode && <BackToBrands />}

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

                <BrandProducts filter={filter} searchQuery={searchQuery} />
            </main>

            <AuthPanel />
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </div>
    );
};
