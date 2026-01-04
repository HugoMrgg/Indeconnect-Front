import React, {useEffect, useState, useMemo, useCallback, useRef} from "react";
import { useTranslation } from "react-i18next";
import { BrandSection } from "@/features/brands/BrandSection";
import { useBrands } from "@/hooks/Brand/useBrands";
import { useUI } from "@/context/UIContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useGeolocation } from "@/hooks/User/useGeolocation";
import { BrandFiltersPanel } from "@/features/filters/BrandFiltersPanel";
import { BrandPageLayout } from "@/features/brands/BrandPageLayout";
import { belgianCities } from "@/types/belgianCities";
import {RecommendationsSection} from "@/features/recommendations/RecommendationsSection";
import {BrandSectionSkeleton} from "@/components/skeletons/BrandSectionSkeleton";
import { Leaf, MapPin, ShieldCheck, ArrowDownRight } from "lucide-react";

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
    const { t } = useTranslation();

    const [apiFilters, setApiFilters] = useState<ApiFilters>({
        page: 1,
        pageSize: 10,
        maxDistanceKm: 80,
    });

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [locationMode, setLocationMode] = useState<"city" | "gps">("city");
    const [allBrands, setAllBrands] = useState<any[]>([]);

    // ✅ Utiliser useRef pour tracker les filtres précédents (hors page)
    const prevFiltersRef = useRef<string>("");

    const { position, loading: gpsLoading, error: gpsError, requestLocation, clearLocation } =
        useGeolocation();

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

    const { brands = [], totalCount, loading, error } = useBrands(cleanedFilters);

    // ✅ Créer une clé unique pour détecter les changements de filtres (sans page)
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            sortBy: apiFilters.sortBy,
            maxDistanceKm: apiFilters.maxDistanceKm,
            userRatingMin: apiFilters.userRatingMin,
            priceRange: apiFilters.priceRange,
            minEthicsProduction: apiFilters.minEthicsProduction,
            minEthicsTransport: apiFilters.minEthicsTransport,
            lat: apiFilters.lat,
            lon: apiFilters.lon,
            ethicTags: apiFilters.ethicTags
        });
    }, [
        apiFilters.sortBy,
        apiFilters.maxDistanceKm,
        apiFilters.userRatingMin,
        apiFilters.priceRange,
        apiFilters.minEthicsProduction,
        apiFilters.minEthicsTransport,
        apiFilters.lat,
        apiFilters.lon,
        apiFilters.ethicTags
    ]);

    // ✅ Détecter les changements de filtres et réinitialiser
    useEffect(() => {
        if (prevFiltersRef.current !== filtersKey && prevFiltersRef.current !== "") {
            // Les filtres ont changé → réinitialiser
            setApiFilters(f => ({ ...f, page: 1 }));
            setAllBrands([]);
        }
        prevFiltersRef.current = filtersKey;
    }, [filtersKey]);

    // ✅ Accumuler les marques quand de nouvelles données arrivent
    useEffect(() => {
        if (!loading && brands.length > 0) {
            if (apiFilters.page === 1) {
                setAllBrands(brands);
            } else {
                setAllBrands(prev => {
                    // Éviter les doublons en utilisant un Set d'IDs
                    const existingIds = new Set(prev.map(b => b.id));
                    const newBrands = brands.filter(b => !existingIds.has(b.id));
                    return [...prev, ...newBrands];
                });
            }
        }
    }, [brands, loading, apiFilters.page]);

    useEffect(() => {
        if (locationMode === "gps" && position) {
            setApiFilters((f) => ({ ...f, lat: position.lat, lon: position.lon }));
        }
    }, [position, locationMode]);

    const hasMore = allBrands.length < totalCount;
    const isLoadingMore = loading && apiFilters.page > 1;

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setApiFilters(f => ({ ...f, page: f.page + 1 }));
        }
    }, [loading, hasMore]);

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return allBrands;
        const query = searchQuery.toLowerCase();
        return allBrands.filter((brand) => {
            const matchName = brand.name?.toLowerCase().includes(query);
            const matchDescription = brand.description?.toLowerCase().includes(query);
            const matchAddress = brand.address?.toLowerCase().includes(query);
            return matchName || matchDescription || matchAddress;
        });
    }, [allBrands, searchQuery]);

    const convertedBrands = useMemo(() => {
        return filteredBrands.map((brand) => ({
            ...brand,
            logoUrl: brand.logoUrl ?? undefined,
            bannerUrl: brand.bannerUrl ?? undefined,
            description: brand.description ?? undefined,
            address: brand.address ?? undefined,
            distanceKm: brand.distanceKm ?? undefined,
        }));
    }, [filteredBrands]);

    const { setScope, filtersOpen, closeFilters } = useUI();

    const scrollToBrands = useCallback(() => {
        document.getElementById("brands-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    useEffect(() => {
        setScope("brands");
        return () => closeFilters();
    }, [setScope, closeFilters]);

    const handleSort = useCallback((sortBy: string) => setApiFilters((f) => ({ ...f, sortBy })), []);
    const handleDistance = useCallback((km: number | undefined) => setApiFilters((f) => ({ ...f, maxDistanceKm: km })), []);
    const handleUserRating = useCallback((rating: number | undefined) => setApiFilters((f) => ({ ...f, userRatingMin: rating })), []);
    const handlePriceRange = useCallback((range: string) => setApiFilters((f) => ({ ...f, priceRange: range })), []);
    const handleEthicsProduction = useCallback((score: number | undefined) => setApiFilters((f) => ({ ...f, minEthicsProduction: score })), []);
    const handleEthicsTransport = useCallback((score: number | undefined) => setApiFilters((f) => ({ ...f, minEthicsTransport: score })), []);
    const handleEthicTags = useCallback((tags: string[]) => setApiFilters((f) => ({ ...f, ethicTags: tags.length > 0 ? tags : undefined })), []);

    const handleCityChange = useCallback((cityName: string) => {
        if (!cityName) {
            setApiFilters((f) => {
                const { lat, lon, ...rest } = f;
                return rest;
            });
            return;
        }
        const city = belgianCities.find((c) => c.name === cityName);
        if (city) setApiFilters((f) => ({ ...f, lat: city.latitude, lon: city.longitude }));
    }, []);

    const handleLocationModeChange = useCallback((mode: "city" | "gps") => {
        setLocationMode(mode);

        if (mode === "city") {
            clearLocation();
        } else {
            setApiFilters((f) => {
                const { lat, lon, ...rest } = f;
                return rest;
            });
        }
    }, [clearLocation]);

    const handleReset = useCallback(() => {
        setApiFilters({ page: 1, pageSize: 10, maxDistanceKm: 80 });
        setSearchQuery("");
        setLocationMode("city");
        setAllBrands([]);
        clearLocation();
    }, [clearLocation]);

    const currentCity = belgianCities.find((c) => c.latitude === apiFilters.lat && c.longitude === apiFilters.lon);

    if (loading && apiFilters.page === 1) {
        return (
            <BrandPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <BrandSectionSkeleton cards={4} />
            </BrandPageLayout>
        );
    }

    if (error && apiFilters.page === 1) {
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
                locationMode={locationMode}
                onChangeLocationMode={handleLocationModeChange}
                onRequestGPS={requestLocation}
                gpsLoading={gpsLoading}
                gpsError={gpsError}
                hasGPSPosition={!!position}
            />

            {/* Hero section reste identique */}
            <section className="px-6 mt-6">
                {/* ... ton code hero ... */}
            </section>

            <div className="items-center mt-6">
                <BrandSection title={t('brands.all_brands')} brands={convertedBrands} />

                {!searchQuery.trim() && hasMore && !error && (
                    <div className="flex justify-center mt-8 mb-8">
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoadingMore ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {t('home.loading')}
                                </>
                            ) : (
                                <>
                                    {t('home.load_more')} ({allBrands.length} / {totalCount})
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            <RecommendationsSection />
        </BrandPageLayout>
    );
};