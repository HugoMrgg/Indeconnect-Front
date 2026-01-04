import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { WishlistService } from "@/api/services/wishlist";
import type { WishlistResponse } from "@/api/services/wishlist/types";

interface UseWishlistState {
    wishlist: WishlistResponse | null;
    loading: boolean;
    error: string | null;
}

interface UseWishlistReturn extends UseWishlistState {
    retry: () => void;
}

export function useWishlist(userId: number | undefined): UseWishlistReturn {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['wishlist', userId],
        queryFn: async ({ signal }) => {
            if (!userId) {
                throw new Error("Utilisateur non authentifié");
            }

            const response = await WishlistService.getWishlist(userId, signal);

            if (!response?.data) {
                throw new Error("Format réponse invalide");
            }

            return response.data as WishlistResponse;
        },
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 min
    });

    const errorMsg = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : error instanceof Error
            ? error.message
            : error ? "Impossible de charger vos favoris" : null;

    return {
        wishlist: data ?? null,
        loading: isLoading,
        error: errorMsg,
        retry: refetch,
    };
}
