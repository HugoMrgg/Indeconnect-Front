import React, { useEffect, useMemo } from "react";
import { BrandSection } from "@/features/brands/BrandSection";
import { useBrands } from "@/hooks/Brand/useBrands";
import { useUI } from "@/context/UIContext";
import { useDebounce } from "@/hooks/useDebounce";
import { BrandFiltersPanel } from "@/features/filters/BrandFiltersPanel";
import { BrandPageLayout } from "@/features/brands/BrandPageLayout";
import { FiltersProvider, useFilters } from "@/context/FiltersContext";

const HomeContent: React.FC = () => {
    const {
        apiFilters,
        searchQuery,
        setSearchQuery,
    } = useFilters();

    const debouncedFilters = useDebounce(apiFilters, 500);

    const cleanedFilters = useMemo(() => {
        return Object.fromEntries(
            Object.entries(debouncedFilters).filter(([, v]) => {
                if (v === undefined || v === null || v === "") return false;
                if (Array.isArray(v) && v.length === 0) return false;
                return true;
            })
        );
    }, [debouncedFilters]);

    const { brands = [], loading, error } = useBrands(cleanedFilters);

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands;
        const query = searchQuery.toLowerCase();
        return brands.filter(brand => {
            const matchName = brand.name?.toLowerCase().includes(query);
            const matchDescription = brand.description?.toLowerCase().includes(query);
            const matchAddress = brand.address?.toLowerCase().includes(query);
            return matchName || matchDescription || matchAddress;
        });
    }, [brands, searchQuery]);

    const convertedBrands = useMemo(() => {
        return filteredBrands.map(brand => ({
            ...brand,
            logoUrl: brand.logoUrl ?? undefined,
            bannerUrl: brand.bannerUrl ?? undefined,
            description: brand.description ?? undefined,
            address: brand.address ?? undefined,
            distanceKm: brand.distanceKm ?? undefined,
        }));
    }, [filteredBrands]);

    const { setScope, filtersOpen, closeFilters } = useUI();

    useEffect(() => {
        setScope("brands");
        return () => closeFilters();
    }, [setScope, closeFilters]);

    if (loading) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex justify-center items-center mt-12">
                    <p className="text-gray-500 animate-pulse">Chargement des marques...</p>
                </div>
            </BrandPageLayout>
        );
    }

    if (error) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex justify-center items-center mt-12">
                    <p className="text-red-600">{error}</p>
                </div>
            </BrandPageLayout>
        );
    }

    return (
        <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            <BrandFiltersPanel
                open={filtersOpen}
                onClose={closeFilters}
            />

            <div className="items-center mt-6">
                <BrandSection title="Toutes les marques :" brands={convertedBrands} />
            </div>
        </BrandPageLayout>
    );
};

export const Home: React.FC = () => {
    return (
        <FiltersProvider>
            <HomeContent />
        </FiltersProvider>
    );
};
