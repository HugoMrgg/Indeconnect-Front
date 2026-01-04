import { useQuery } from "@tanstack/react-query";
import { brandsService } from "@/api/services/brands";
import { EthicsSortType } from "@/api/services/brands/types";

interface BrandFilters {
    page?: number;
    pageSize?: number;
    sortBy?: EthicsSortType;
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
    const { data, isLoading, error } = useQuery({
        queryKey: ['brands', filters],
        queryFn: async () => {
            return await brandsService.getBrands(filters);
        },
        staleTime: 3 * 60 * 1000, // 3 minutes (données des marques changent peu)
    });

    return {
        brands: data?.brands ?? [],
        totalCount: data?.totalCount ?? 0,
        page: data?.page ?? 1,
        pageSize: data?.pageSize ?? 10,
        loading: isLoading,
        error: error ? "Impossible de charger les marques." : null
    };
}
