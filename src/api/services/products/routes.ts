export const PRODUCTS_ROUTES = {
    byBrand: (brandId: number) => `/brands/${brandId}/products`,
    byId: (productId: number) => `/products/${productId}`,
    variants: (productId: number) => `/products/${productId}/variants`,
    colors: (productId: number) => `/products/${productId}/colors`,
    stock: (productId: number) => `/products/${productId}/stock`,
    reviews: (productId: number) => `/products/${productId}/reviews`,
    create: () => `/products/create`,
    update: (productId: number) => `/products/${productId}`,

    // Product Groups routes
    createGroup: () => `/product-groups`,  // ✅ Sans /create
    getGroup: (groupId: number) => `/product-groups/${groupId}`,
    groupsByBrand: (brandId: number) => `/product-groups/brand/${brandId}`,
    updateGroup: (groupId: number) => `/product-groups/${groupId}`,
    deleteGroup: (groupId: number) => `/product-groups/${groupId}`,
};
