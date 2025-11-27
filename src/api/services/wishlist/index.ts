import axiosInstance from "@/api/api";
import {WISHLIST_ROUTES} from "@/api/services/wishlist/routes";

export const WishlistService = {
    getWishlist: async (userId: number) => {
        return axiosInstance.get(WISHLIST_ROUTES.get(userId));
    },
    addToWishlist: async (userId: number, productId: number) => {
        return axiosInstance.post(WISHLIST_ROUTES.add(userId), { productId });
    },
    removeFromWishlist: async (userId: number | undefined, productId: number) => {
        return axiosInstance.delete(WISHLIST_ROUTES.remove(userId, productId));
    },
    isInWishlist: async (userId: number | undefined, productId: number) => {
        return axiosInstance.get(WISHLIST_ROUTES.isIn(userId, productId));
    }
};
