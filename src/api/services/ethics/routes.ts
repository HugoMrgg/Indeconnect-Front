export const ETHICS_ROUTES = {
    // Admin catalogue
    getAdminCatalog: "/ethics/catalog",
    saveAdminCatalog: "/ethics/catalog",

    // SuperVendor questionnaire (pour sa marque)
    getMyForm: "/ethics/questionnaire",
    saveMyForm: "/ethics/questionnaire",

    // si tu as un endpoint tags séparé, garde-le
    tags: "/ethics/tags",
} as const;
