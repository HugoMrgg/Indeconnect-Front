export const WISHLIST_ROUTES = {
    get: (userId: number) => `/users/${userId}/wishlist`,
    add: (userId: number) => `/users/${userId}/wishlist/items`,
    remove: (userId: number | undefined, productId: number) => `/users/${userId}/wishlist/items/${productId}`,
    isIn: (userId: number | undefined, productId: number) => `/users/${userId}/wishlist/items/${productId}/exists`,
} as const;