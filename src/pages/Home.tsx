import React, { useEffect, useState, useMemo, useCallback } from "react";
import { BrandSection } from "@/features/brands/BrandSection";
import { useBrands } from "@/hooks/Brand/useBrands";
import { useUI } from "@/context/UIContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useGeolocation } from "@/hooks/User/useGeolocation";
import { BrandFiltersPanel } from "@/features/filters/BrandFiltersPanel";
import { BrandPageLayout } from "@/features/brands/BrandPageLayout";
import { belgianCities } from "@/types/belgianCities";
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
    const [apiFilters, setApiFilters] = useState<ApiFilters>({
        page: 1,
        pageSize: 10,
        maxDistanceKm: 80,
    });

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [locationMode, setLocationMode] = useState<"city" | "gps">("city");

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

    const { brands = [], loading, error } = useBrands(cleanedFilters);

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands;
        const query = searchQuery.toLowerCase();
        return brands.filter((brand) => {
            const matchName = brand.name?.toLowerCase().includes(query);
            const matchDescription = brand.description?.toLowerCase().includes(query);
            const matchAddress = brand.address?.toLowerCase().includes(query);
            return matchName || matchDescription || matchAddress;
        });
    }, [brands, searchQuery]);

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

    useEffect(() => {
        setScope("brands");
        return () => closeFilters();
    }, [setScope, closeFilters]);

    useEffect(() => {
        if (locationMode === "gps" && position) {
            setApiFilters((f) => ({ ...f, lat: position.lat, lon: position.lon }));
        }
    }, [position, locationMode]);

    const handleSort = (sortBy: string) => setApiFilters((f) => ({ ...f, sortBy }));
    const handleDistance = (km: number | undefined) => setApiFilters((f) => ({ ...f, maxDistanceKm: km }));
    const handleUserRating = (rating: number | undefined) => setApiFilters((f) => ({ ...f, userRatingMin: rating }));
    const handlePriceRange = (range: string) => setApiFilters((f) => ({ ...f, priceRange: range }));
    const handleEthicsProduction = (score: number | undefined) => setApiFilters((f) => ({ ...f, minEthicsProduction: score }));
    const handleEthicsTransport = (score: number | undefined) => setApiFilters((f) => ({ ...f, minEthicsTransport: score }));
    const handleEthicTags = (tags: string[]) => setApiFilters((f) => ({ ...f, ethicTags: tags.length > 0 ? tags : undefined }));

    const handleCityChange = (cityName: string) => {
        if (!cityName) {
            setApiFilters((f) => {
                const { lat, lon, ...rest } = f;
                return rest;
            });
            return;
        }
        const city = belgianCities.find((c) => c.name === cityName);
        if (city) setApiFilters((f) => ({ ...f, lat: city.latitude, lon: city.longitude }));
    };

    const handleLocationModeChange = (mode: "city" | "gps") => {
        setLocationMode(mode);

        if (mode === "city") {
            clearLocation();
        } else {
            setApiFilters((f) => {
                const { lat, lon, ...rest } = f;
                return rest;
            });
        }
    };

    const handleReset = () => {
        setApiFilters({ page: 1, pageSize: 10, maxDistanceKm: 80 });
        setSearchQuery("");
        setLocationMode("city");
        clearLocation();
    };

    const currentCity = belgianCities.find((c) => c.latitude === apiFilters.lat && c.longitude === apiFilters.lon);

    const scrollToBrands = useCallback(() => {
        document.getElementById("brands-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

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

            <section className="px-6 mt-6">
                <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-gray-400">
                                Plateforme de marques responsables
                            </p>
                            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                                Trouve des marques qui font mieux, pas juste “plus”.
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                                Ici, on référence des marques sélectionnées pour leur démarche : production plus éthique,
                                transport plus cohérent, transparence sur l’origine et la qualité. Tu filtres, tu compares,
                                tu choisis — sans te noyer dans le greenwashing.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                    <Leaf size={18} /> Éthique
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                    Scores “production” & “transport” pour décider en 10 secondes.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                    <MapPin size={18} /> Proximité
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                    Filtre par ville ou GPS pour privilégier le local quand c’est possible.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                    <ShieldCheck size={18} /> Confiance
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                    Avis utilisateurs + infos claires : tu sais pourquoi une marque est là.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <button
                                type="button"
                                onClick={scrollToBrands}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-2.5
                           hover:bg-black/90 transition"
                            >
                                Découvrir les marques <ArrowDownRight size={18} />
                            </button>

                            <p className="text-xs text-gray-400">
                                Astuce : clique sur “Filtres” en bas pour affiner (distance, prix, éthique…).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="items-center mt-6">
                {loading && (
                    <div className="flex justify-center items-center mt-8">
                        <p className="text-gray-500 animate-pulse">Chargement des marques...</p>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center mt-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div id="brands-section" className="scroll-mt-24">
                        <BrandSection title="Toutes les marques :" brands={convertedBrands} />
                    </div>
                )}
            </div>
        </BrandPageLayout>
    );
};
