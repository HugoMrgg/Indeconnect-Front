export const PRODUCTS_ROUTES = {
    byBrand: (brandId: number) => `/brands/${brandId}/products`,
    byId: (productId: number) => `/products/${productId}`,
    variants: (productId: number) => `/products/${productId}/variants`,
    colors: (productId: number) => `/products/${productId}/colors`,
    stock: (productId: number) => `/products/${productId}/stock`,
    reviews: (productId: number) => `/products/${productId}/reviews`,
    canReview: (productId: number) => `/products/${productId}/can-review`,
    disableReview: (productId: number) => `/products/reviews/${productId}/disable`
};