export const SHIPPING_ROUTES = {
    // Adresses
    getUserAddresses: (userId: number) => `/users/${userId}/shipping-addresses`,
    createAddress: (userId: number) => `/users/${userId}/shipping-addresses`,

    // Méthodes de livraison
    getBrandMethods: (brandId: number) => `/shipping/brands/${brandId}/methods`,
    getMultipleBrandsMethods: () => `/shipping/brands/methods`,

    // Gestion par SuperVendor
    createBrandMethod: (brandId: number) => `/brands/${brandId}/shipping-methods`,
    updateBrandMethod: (brandId: number, methodId: number) =>
        `/brands/${brandId}/shipping-methods/${methodId}`,
    deleteBrandMethod: (brandId: number, methodId: number) =>
        `/brands/${brandId}/shipping-methods/${methodId}`,
} as const;
