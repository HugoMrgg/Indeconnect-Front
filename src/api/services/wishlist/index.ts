import axiosInstance from "@/api/api";
import { WISHLIST_ROUTES } from "@/api/services/wishlist/routes";

export const WishlistService = {
    getWishlist: async (userId: number, signal?: AbortSignal) => {
        return axiosInstance.get(WISHLIST_ROUTES.get(userId), { signal });
    },

    addToWishlist: async (userId: number, productId: number, signal?: AbortSignal) => {
        return axiosInstance.post(
            WISHLIST_ROUTES.add(userId),
            { productId },
            { signal }
        );
    },

    removeFromWishlist: async (userId: number | undefined, productId: number, signal?: AbortSignal) => {
        return axiosInstance.delete(
            WISHLIST_ROUTES.remove(userId, productId),
            { signal }
        );
    },

    isInWishlist: async (userId: number | undefined, productId: number, signal?: AbortSignal) => {
        return axiosInstance.get(
            WISHLIST_ROUTES.isIn(userId, productId),
            { signal }
        );
    },
};
