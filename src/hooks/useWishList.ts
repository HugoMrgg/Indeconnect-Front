import { useEffect, useState, useCallback } from "react";
import { WishlistService } from "@/api/services/wishlist";
import { WishlistResponse } from "@/api/services/wishlist/types";

export function useWishlist(userId: number | undefined) {
    const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await WishlistService.getWishlist(userId);
            setWishlist(response.data as WishlistResponse);
        } catch (err: any) {
            console.error("Erreur wishlist:", err);
            setError("Impossible de charger vos favoris.");
        }

        setLoading(false);
    }, [userId]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        wishlist,
        loading,
        error,
        retry: load,
    };
}
