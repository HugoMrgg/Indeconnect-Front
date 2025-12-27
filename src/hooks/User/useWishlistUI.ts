import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { WishlistService } from "@/api/services/wishlist";
import { Product } from "@/types/Product";

interface UseWishlistUIReturn {
    likedMap: Record<number, boolean>;
    toggleLike: (productId: number) => Promise<void>;
    loading: boolean;
}

/**
 * Hook pour gérer l'UI de la wishlist (likes sur les produits)
 * Encapsule la logique de chargement des likes et toggle like/unlike
 */
export function useWishlistUI(
    userId: number | undefined,
    products: Product[]
): UseWishlistUIReturn {
    const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(false);

    // Charger les likes initiaux pour tous les produits
    useEffect(() => {
        if (!userId || products.length === 0) {
            setLikedMap({});
            return;
        }

        async function loadLikes() {
            setLoading(true);
            const map: Record<number, boolean> = {};

            await Promise.all(
                products.map(async (p) => {
                    try {
                        const res = await WishlistService.isInWishlist(userId, p.id);
                        map[p.id] = res.data.exists === true;
                    } catch {
                        map[p.id] = false;
                    }
                })
            );

            setLikedMap(map);
            setLoading(false);
        }

        void loadLikes();
    }, [userId, products]);

    // Toggle like/unlike d'un produit
    const toggleLike = useCallback(
        async (productId: number) => {
            if (!userId) {
                toast.error("Connecte-toi pour ajouter aux favoris ❤️");
                return;
            }

            const current = likedMap[productId] ?? false;

            // Optimistic update
            setLikedMap((prev) => ({ ...prev, [productId]: !current }));

            try {
                if (!current) {
                    await WishlistService.addToWishlist(userId, productId);
                    toast.success("Ajouté à vos favoris ❤️", {
                        style: {
                            background: "#000",
                            color: "#fff",
                            borderRadius: "10px",
                        },
                    });
                } else {
                    await WishlistService.removeFromWishlist(userId, productId);
                    toast.success("Retiré de vos favoris 💔", {
                        style: {
                            background: "#000",
                            color: "#fff",
                            borderRadius: "10px",
                        },
                    });
                }
            } catch (err) {
                console.error("Wishlist error", err);
                // Rollback en cas d'erreur
                setLikedMap((prev) => ({ ...prev, [productId]: current }));
                toast.error("Une erreur est survenue");
            }
        },
        [userId, likedMap]
    );

    return {
        likedMap,
        toggleLike,
        loading,
    };
}
