import { useState, useEffect, useCallback } from "react";
import { brandsService } from "@/api/services/brands";
import { BrandDetailDTO } from "@/api/services/brands/types";
import { extractErrorMessage } from "@/utils/errorHandling";

interface UseBrandDetailReturn {
    brand: BrandDetailDTO | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useBrandDetail(brandId: number | null): UseBrandDetailReturn {
    const [brand, setBrand] = useState<BrandDetailDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBrand = useCallback(async () => {
        if (!brandId) return;

        setLoading(true);
        setError(null);

        try {
            const detail = await brandsService.getBrandById(brandId, undefined, undefined);
            setBrand(detail);
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[useBrandDetail] fetchBrand error:", err);
        } finally {
            setLoading(false);
        }
    }, [brandId]);

    useEffect(() => {
        fetchBrand();
    }, [fetchBrand]);

    return {
        brand,
        loading,
        error,
        refetch: fetchBrand,
    };
}
