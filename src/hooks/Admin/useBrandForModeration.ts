import { useQuery } from "@tanstack/react-query";
import { brandsService } from "@/api/services/brands";
import { BrandModerationDetailDTO } from "@/api/services/brands/types";

interface UseBrandForModerationReturn {
    brand: BrandModerationDetailDTO | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useBrandForModeration(brandId: number): UseBrandForModerationReturn {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['brand-moderation', brandId],
        queryFn: async () => {
            return await brandsService.getBrandForModeration(brandId);
        },
        enabled: brandId > 0,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    return {
        brand: data ?? null,
        loading: isLoading,
        error: error ? "Impossible de charger la marque." : null,
        refetch
    };
}
