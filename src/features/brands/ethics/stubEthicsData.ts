export enum EthicsCategory {
    MaterialsManufacturing = "MaterialsManufacturing",
    Transport = "Transport",
}

export type EthicsOptionDTO = {
    id: number;
    key: string;
    label: string;
    score: number; // decimal côté C# -> number côté TS
};

export type EthicsQuestionDTO = {
    id: number;
    category: EthicsCategory;
    key: string;
    label: string;
    order: number;
    options: EthicsOptionDTO[];
};

export const stubEthicsQuestions: EthicsQuestionDTO[] = [
    // TRANSPORT
    {
        id: 101,
        category: EthicsCategory.Transport,
        key: "transport.distance",
        label: "Distance moyenne de livraison",
        order: 1,
        options: [
            { id: 1001, key: "lt50", label: "Moins de 50 km", score: 25 },
            { id: 1002, key: "50_300", label: "50 à 300 km", score: 18 },
            { id: 1003, key: "300_1000", label: "300 à 1000 km", score: 10 },
            { id: 1004, key: "gt1000", label: "Plus de 1000 km", score: 3 },
        ],
    },
    {
        id: 102,
        category: EthicsCategory.Transport,
        key: "transport.method",
        label: "Mode de transport principal",
        order: 2,
        options: [
            { id: 1011, key: "bike", label: "Livraison douce (vélo/cargo en local)", score: 20 },
            { id: 1012, key: "green", label: "Transporteur “green” / compensation CO₂", score: 14 },
            { id: 1013, key: "standard", label: "Standard", score: 8 },
            { id: 1014, key: "air", label: "Avion (air freight)", score: 0 },
        ],
    },
    {
        id: 103,
        category: EthicsCategory.Transport,
        key: "transport.packaging",
        label: "Emballage (global)",
        order: 3,
        options: [
            { id: 1021, key: "best", label: "Sans plastique + recyclé + minimal", score: 20 },
            { id: 1022, key: "good", label: "Recyclé + minimal (plastique limité)", score: 14 },
            { id: 1023, key: "ok", label: "Standard", score: 8 },
            { id: 1024, key: "bad", label: "Plastique majoritaire / sur-emballage", score: 2 },
        ],
    },

    // MATERIALS & MANUFACTURING
    {
        id: 201,
        category: EthicsCategory.MaterialsManufacturing,
        key: "prod.region",
        label: "Zone de fabrication principale",
        order: 1,
        options: [
            { id: 2001, key: "local", label: "Local (même pays)", score: 25 },
            { id: 2002, key: "eu", label: "Europe", score: 18 },
            { id: 2003, key: "world", label: "Hors Europe", score: 10 },
        ],
    },
    {
        id: 202,
        category: EthicsCategory.MaterialsManufacturing,
        key: "prod.materials",
        label: "Matières utilisées",
        order: 2,
        options: [
            { id: 2011, key: "organic_recycled", label: "Bio et/ou recyclé majoritaire", score: 25 },
            { id: 2012, key: "mix", label: "Mix (bio/recyclé partiel)", score: 15 },
            { id: 2013, key: "synthetic", label: "Synthétique majoritaire (vierge)", score: 5 },
        ],
    },
    {
        id: 203,
        category: EthicsCategory.MaterialsManufacturing,
        key: "prod.social",
        label: "Conditions sociales / audit fournisseurs",
        order: 3,
        options: [
            { id: 2021, key: "audited_wage", label: "Audits + politique salaire décent", score: 25 },
            { id: 2022, key: "audited", label: "Audits réguliers", score: 15 },
            { id: 2023, key: "unknown", label: "Non documenté / inconnu", score: 5 },
        ],
    },
    {
        id: 204,
        category: EthicsCategory.MaterialsManufacturing,
        key: "prod.labels",
        label: "Certifications (au moins une)",
        order: 4,
        options: [
            { id: 2031, key: "multi", label: "Plusieurs (GOTS/Fairtrade/OEKO/B-Corp…)", score: 20 },
            { id: 2032, key: "one", label: "Une certification", score: 12 },
            { id: 2033, key: "none", label: "Aucune", score: 3 },
        ],
    },
];
