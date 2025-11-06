import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { BannerBrand } from "@/features/banners/BannerBrand";
import { FiltersPanel } from "@/features/filters/FiltersPanel";
import { NavBar } from "@/features/navbar/NavBar";

import { useProducts } from "@/hooks/useProducts";
import { useBrands } from "@/hooks/useBrands";
import { useProductFilters } from "@/hooks/useProductFilters";
import {BrandHeader} from "@/features/brands/BrandHeader";
import {BackToBrands} from "@/features/brands/BackToBrands";
import {BrandProducts} from "@/features/brands/BrandProducts";
import {BrandLoading} from "@/features/brands/BrandLoading";
import {BrandError} from "@/features/brands/BrandError";

export const BrandPage: React.FC = () => {
    const { brandName } = useParams();
    const decodedBrand = decodeURIComponent(brandName ?? "");

    const { products, loading, error } = useProducts(decodedBrand);
    const [subscribed, setSubscribed] = useState(false);
    const { brandsNearby, ethicalBrands } = useBrands();
    const brand = [...brandsNearby, ...ethicalBrands].find(b => b.name === decodedBrand);

    const filter = useProductFilters(products);
    const [filtersOpen, setFiltersOpen] = useState(false);

    if (loading) return <BrandLoading name={decodedBrand} />;
    if (error) return <BrandError name={decodedBrand} message={error} />;

    return (
        <div className="min-h-full bg-white">
            <BannerBrand name={decodedBrand} />

            <main className="mx-auto max-w-6xl px-4 pb-16">
                <BrandHeader
                    brand={brand}
                    subscribed={subscribed}
                    onToggleSubscribe={() => setSubscribed(!subscribed)}
                />

                <BackToBrands />

                <FiltersPanel
                    open={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                    onReset={filter.resetAll}
                    resetKey={filter.resetKey}

                    // Filtres classiques
                    onChangePrice={filter.handlePrice}
                    onChangeCategories={filter.handleCategories}
                    onChangeSizes={filter.handleSizes}

                    // Filtres avancés
                    onChangeColors={filter.handleColors}
                    onChangeEthics={filter.handleEthics}

                    selectedCategories={filter.categories}
                    selectedSizes={filter.sizes}
                    selectedColors={filter.colors}
                    selectedEthics={filter.ethics}

                    // Options disponibles dans les produits affichés
                    colorsAvailable={filter.availableColors}
                    ethicsAvailable={filter.availableEthics}
                />


                <BrandProducts
                    filter={filter}
                />

            </main>

            <NavBar
                scope="products"
                onToggleFilters={() => setFiltersOpen(prev => !prev)}
            />
        </div>
    );
};
