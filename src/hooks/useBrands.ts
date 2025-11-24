import { useState, useEffect, useRef } from "react";
import { brandsService } from "@/api/services/brands";
import { Brand } from "@/types/brand";

interface BrandFilters {
    page?: number;
    pageSize?: number;
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

export function useBrands(filters: BrandFilters = {}) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const prevFiltersRef = useRef<string>("");

    useEffect(() => {
        const filtersString = JSON.stringify(filters);

        if (prevFiltersRef.current === filtersString) {
            return;
        }

        prevFiltersRef.current = filtersString;

        const loadBrands = async () => {
            try {
                setLoading(true);
                const response = await brandsService.getBrands(filters);
                setBrands(response.brands ?? []);
                setError(null);
            } catch (err) {
                console.error("Erreur chargement marques:", err);
                setError("Impossible de charger les marques.");
                setBrands([]);
            } finally {
                setLoading(false);
            }
        };

        loadBrands();
    }, [filters]);

    return { brands, loading, error };
}
