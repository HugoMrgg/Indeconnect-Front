export const cartRoutes = {
    get: (userId: number) => `/users/${userId}/cart`,
    addVariant: (userId: number, variantId: number) =>
        `/users/${userId}/cart/variant/${variantId}`,
    removeVariant: (userId: number, variantId: number) =>
        `/users/${userId}/cart/variant/${variantId}`,
    clear: (userId: number) => `/users/${userId}/cart`,
};
