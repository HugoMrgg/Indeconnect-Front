import React, { useEffect, useState, useMemo } from "react";
import { BrandSection } from "@/features/brands/BrandSection";
import { useBrands } from "@/hooks/useBrands";
import { useUI } from "@/context/UIContext";
import { useDebounce } from "@/hooks/useDebounce";
import { BrandFiltersPanel } from "@/features/filters/BrandFiltersPanel";
import { BrandPageLayout } from "@/features/brands/BrandPageLayout";
import { belgianCities } from "@/types/belgianCities";

interface ApiFilters {
    page: number;
    pageSize: number;
    sortBy?: string;
    maxDistanceKm?: number;
    userRatingMin?: number;
    priceRange?: string;
    minEthicsProduction?: number;
    minEthicsTransport?: number;
    lat?: number;
    lon?: number;
    ethicTags?: string[];
}

export const Home: React.FC = () => {
    const [apiFilters, setApiFilters] = useState<ApiFilters>({
        page: 1,
        pageSize: 10,
        maxDistanceKm: 80,
    });

    const [searchQuery, setSearchQuery] = useState<string>("");

    // Attendre 500ms avant d'appeler l'API (évite les spams)
    const debouncedFilters = useDebounce(apiFilters, 500);

    // Nettoyer les filtres vides
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

    // Filtrer les marques par recherche texte
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

    const { setScope, filtersOpen, closeFilters } = useUI();

    useEffect(() => {
        setScope("brands");
        return () => closeFilters();
    }, [setScope, closeFilters]);

    // Handlers pour les filtres
    const handleSort = (sortBy: string) => setApiFilters(f => ({ ...f, sortBy }));
    const handleDistance = (km: number | undefined) => setApiFilters(f => ({ ...f, maxDistanceKm: km }));
    const handleUserRating = (rating: number | undefined) => setApiFilters(f => ({ ...f, userRatingMin: rating }));
    const handlePriceRange = (range: string) => setApiFilters(f => ({ ...f, priceRange: range }));
    const handleEthicsProduction = (score: number | undefined) => setApiFilters(f => ({ ...f, minEthicsProduction: score }));
    const handleEthicsTransport = (score: number | undefined) => setApiFilters(f => ({ ...f, minEthicsTransport: score }));
    const handleEthicTags = (tags: string[]) => setApiFilters(f => ({ ...f, ethicTags: tags.length > 0 ? tags : undefined }));

    const handleCityChange = (cityName: string) => {
        if (!cityName) {
            setApiFilters(f => {
                const { lat, lon, ...rest } = f;
                return rest;
            });
            return;
        }
        const city = belgianCities.find(c => c.name === cityName);
        if (city) {
            setApiFilters(f => ({ ...f, lat: city.latitude, lon: city.longitude }));
        }
    };

    const handleReset = () => {
        setApiFilters({ page: 1, pageSize: 10, maxDistanceKm: 80 });
        setSearchQuery("");
    };

    const currentCity = belgianCities.find(
        c => c.latitude === apiFilters.lat && c.longitude === apiFilters.lon
    );

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
                onReset={handleReset}
                resetKey={apiFilters.page}
                sortBy={apiFilters.sortBy ?? ""}
                onChangeSort={handleSort}
                distance={apiFilters.maxDistanceKm}
                onChangeDistance={handleDistance}
                minRating={apiFilters.userRatingMin}
                onChangeRating={handleUserRating}
                priceRange={apiFilters.priceRange ?? ""}
                onChangePriceRange={handlePriceRange}
                minEthicsProduction={apiFilters.minEthicsProduction}
                onChangeEthicsProduction={handleEthicsProduction}
                minEthicsTransport={apiFilters.minEthicsTransport}
                onChangeEthicsTransport={handleEthicsTransport}
                selectedCity={currentCity?.name ?? ""}
                onChangeCity={handleCityChange}
                selectedEthicTags={apiFilters.ethicTags ?? []}
                onChangeEthicTags={handleEthicTags}
            />

            <div className="items-center mt-6">
                <BrandSection title="Toutes les marques :" brands={filteredBrands} />
            </div>
        </BrandPageLayout>
    );
};
