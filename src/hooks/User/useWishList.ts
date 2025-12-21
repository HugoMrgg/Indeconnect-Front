import { useEffect, useState, useCallback, useRef } from "react";
import { AxiosError } from "axios";
import { WishlistService } from "@/api/services/wishlist";
import type { WishlistResponse } from "@/api/services/wishlist/types";
import toast from "react-hot-toast";

interface UseWishlistState {
    wishlist: WishlistResponse | null;
    loading: boolean;
    error: string | null;
}

interface UseWishlistReturn extends UseWishlistState {
    retry: () => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
}

export function useWishlist(userId: number | undefined): UseWishlistReturn {
    const [state, setState] = useState<UseWishlistState>({
        wishlist: null,
        loading: true,
        error: null,
    });

    // Ref pour tracker les montages/démontages
    const abortControllerRef = useRef<AbortController | null>(null);

    const load = useCallback(async () => {
        if (!userId) {
            setState({
                wishlist: null,
                loading: false,
                error: "Utilisateur non authentifié",
            });
            return;
        }

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await WishlistService.getWishlist(
                userId,
                abortControllerRef.current.signal
            );

            if (abortControllerRef.current.signal.aborted) return;

            if (!response?.data) {
                throw new Error("Format réponse invalide");
            }

            setState({
                wishlist: response.data as WishlistResponse,
                loading: false,
                error: null,
            });
        } catch (err) {
            if (abortControllerRef.current.signal.aborted) return;

            const errorMsg =
                err instanceof AxiosError
                    ? err.response?.data?.message || err.message
                    : err instanceof Error
                        ? err.message
                        : "Impossible de charger vos favoris";

            console.error("[useWishlist] Erreur:", errorMsg);

            setState({
                wishlist: null,
                loading: false,
                error: errorMsg,
            });
        }
    }, [userId]);

    const removeFromWishlist = useCallback(async (productId: number) => {
        if (!userId) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }

        try {
            await WishlistService.removeFromWishlist(userId, productId);

            toast.success("Produit supprimé de vos favoris ❤️", {
                icon: "🗑️",
                style: {
                    borderRadius: "10px",
                    background: "#000",
                    color: "#fff",
                },
            });

            await load();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Erreur lors de la suppression";
            toast.error(message);
            throw e;
        }
    }, [userId, load]);

    useEffect(() => {
        load();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [load, userId]);

    return {
        ...state,
        retry: load,
        removeFromWishlist,
    };
}
