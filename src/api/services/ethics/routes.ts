export const ETHICS_ROUTES = {
    // Admin catalogue
    getAdminCatalog: "/admin/ethics/catalog",
    saveAdminCatalog: "/admin/ethics/catalog",
    publishCatalog: "/admin/ethics/catalog/publish",

    // SuperVendor questionnaire
    getMyForm: "/ethics/questionnaire",
    saveMyForm: "/ethics/questionnaire",
    markReviewed: "/ethics/questionnaire/mark-reviewed",

    // Public
    tags: "/ethics/tags",
} as const;
