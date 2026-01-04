import { useQuery } from "@tanstack/react-query";
import { brandsService } from "@/api/services/brands";
import { BrandModerationListDTO } from "@/api/services/brands/types";

interface UseBrandsForModerationReturn {
    brands: BrandModerationListDTO[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useBrandsForModeration(): UseBrandsForModerationReturn {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['brands-moderation'],
        queryFn: async () => {
            return await brandsService.getBrandsForModeration();
        },
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    return {
        brands: data ?? [],
        loading: isLoading,
        error: error ? "Impossible de charger les marques." : null,
        refetch
    };
}
