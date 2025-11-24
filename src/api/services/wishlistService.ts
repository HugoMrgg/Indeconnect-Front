import axiosInstance from "@/api/api";

export const WishlistService = {
    getWishlist: async (userId: number) => {
        return axiosInstance.get(`/users/${userId}/wishlist`);
    },
    addToWishlist: async (userId: number, productId: number) => {
        return axiosInstance.post(`/users/${userId}/wishlist/items`, { productId });
    },
    removeFromWishlist: async (userId: number, productId: number) => {
        return axiosInstance.delete(`/users/${userId}/wishlist/items/${productId}`);
    },
    isInWishlist: async (userId: number, productId: number) => {
        return axiosInstance.get(`/users/${userId}/wishlist/items/${productId}/exists`);
    }
};
