export const BRANDS_ROUTES = {
    all: "/brands",
    byId: (brandId: number) => `/brands/${brandId}`,
    myBrand: "/brands/my-brand",
    update: (brandId: number) => `/brands/${brandId}`,
    request: "/brands/request",
} as const;
