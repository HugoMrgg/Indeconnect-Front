export const BRANDS_ROUTES = {
    all: "/brands",
    byId: (brandId: number) => `/brands/${brandId}`
} as const;