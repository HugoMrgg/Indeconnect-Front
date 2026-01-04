import { useQuery, useQueryClient } from "@tanstack/react-query";
import { brandsService } from "@/api/services/brands";
import { BrandDetailDTO } from "@/api/services/brands/types";

interface UseMyBrandReturn {
    brand: BrandDetailDTO | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useMyBrand(): UseMyBrandReturn {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['my-brand'],
        queryFn: async () => {
            return await brandsService.getMyBrand();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['my-brand'] });
    };

    return {
        brand: data ?? null,
        loading: isLoading,
        error: error ? "Impossible de charger votre marque." : null,
        refetch: invalidate  // ➕ Utiliser invalidate au lieu de refetch
    };
}
