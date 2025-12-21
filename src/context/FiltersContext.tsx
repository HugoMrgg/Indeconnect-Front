import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/User/useGeolocation";
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

interface FiltersContextType {
    // State
    apiFilters: ApiFilters;
    searchQuery: string;
    locationMode: "city" | "gps";

    // Geolocation
    position: { lat: number; lon: number } | null;
    gpsLoading: boolean;
    gpsError: string | null;

    // Actions
    setSearchQuery: (query: string) => void;
    handleSort: (sortBy: string) => void;
    handleDistance: (km: number | undefined) => void;
    handleUserRating: (rating: number | undefined) => void;
    handlePriceRange: (range: string) => void;
    handleEthicsProduction: (score: number | undefined) => void;
    handleEthicsTransport: (score: number | undefined) => void;
    handleEthicTags: (tags: string[]) => void;
    handleCityChange: (cityName: string) => void;
    handleLocationModeChange: (mode: "city" | "gps") => void;
    handleReset: () => void;

    // Computed
    currentCity: string | undefined;
    resetKey: number;
}

const FiltersContext = createContext<FiltersContextType | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
    const [apiFilters, setApiFilters] = useState<ApiFilters>({
        page: 1,
        pageSize: 10,
        maxDistanceKm: 80,
    });

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [locationMode, setLocationMode] = useState<"city" | "gps">("city");

    const { position, loading: gpsLoading, error: gpsError, requestLocation, clearLocation } = useGeolocation();

    // Sync GPS position with apiFilters
    useEffect(() => {
        if (locationMode === "gps" && position) {
            setApiFilters(f => ({ ...f, lat: position.lat, lon: position.lon }));
        }
    }, [position, locationMode]);

    const handleSort = useCallback((sortBy: string) => {
        setApiFilters(f => ({ ...f, sortBy }));
    }, []);

    const handleDistance = useCallback((km: number | undefined) => {
        setApiFilters(f => ({ ...f, maxDistanceKm: km }));
    }, []);

    const handleUserRating = useCallback((rating: number | undefined) => {
        setApiFilters(f => ({ ...f, userRatingMin: rating }));
    }, []);

    const handlePriceRange = useCallback((range: string) => {
        setApiFilters(f => ({ ...f, priceRange: range }));
    }, []);

    const handleEthicsProduction = useCallback((score: number | undefined) => {
        setApiFilters(f => ({ ...f, minEthicsProduction: score }));
    }, []);

    const handleEthicsTransport = useCallback((score: number | undefined) => {
        setApiFilters(f => ({ ...f, minEthicsTransport: score }));
    }, []);

    const handleEthicTags = useCallback((tags: string[]) => {
        setApiFilters(f => ({ ...f, ethicTags: tags.length > 0 ? tags : undefined }));
    }, []);

    const handleCityChange = useCallback((cityName: string) => {
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
    }, []);

    const handleLocationModeChange = useCallback((mode: "city" | "gps") => {
        setLocationMode(mode);

        if (mode === "city") {
            // Switch to city mode: clear GPS
            clearLocation();
        } else {
            // Switch to GPS mode: clear city, request GPS
            setApiFilters(f => {
                const { lat, lon, ...rest } = f;
                return rest;
            });
            requestLocation();
        }
    }, [clearLocation, requestLocation]);

    const handleReset = useCallback(() => {
        setApiFilters({ page: 1, pageSize: 10, maxDistanceKm: 80 });
        setSearchQuery("");
        setLocationMode("city");
        clearLocation();
    }, [clearLocation]);

    const currentCity = belgianCities.find(
        c => c.latitude === apiFilters.lat && c.longitude === apiFilters.lon
    )?.name;

    return (
        <FiltersContext.Provider
            value={{
                apiFilters,
                searchQuery,
                locationMode,
                position,
                gpsLoading,
                gpsError,
                setSearchQuery,
                handleSort,
                handleDistance,
                handleUserRating,
                handlePriceRange,
                handleEthicsProduction,
                handleEthicsTransport,
                handleEthicTags,
                handleCityChange,
                handleLocationModeChange,
                handleReset,
                currentCity,
                resetKey: apiFilters.page,
            }}
        >
            {children}
        </FiltersContext.Provider>
    );
}

export const useFilters = () => {
    const ctx = useContext(FiltersContext);
    if (!ctx) throw new Error("useFilters must be used inside <FiltersProvider>");
    return ctx;
};
