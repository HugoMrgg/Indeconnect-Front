export const BRANDS_ROUTES = {
    all: "/brands",
    byId: (brandId: number) => `/brands/${brandId}`,
    myBrand: "/brands/my-brand",
    update: (brandId: number) => `/brands/${brandId}`,
    request: "/brands/request",
    submit: (brandId: number) => `/brands/${brandId}/submit`,
    moderation: "/brands/moderation",
    moderationDetail: (brandId: number) => `/brands/moderation/${brandId}`,
    approve: (brandId: number) => `/brands/${brandId}/approve`,
    reject: (brandId: number) => `/brands/${brandId}/reject`,
} as const;
