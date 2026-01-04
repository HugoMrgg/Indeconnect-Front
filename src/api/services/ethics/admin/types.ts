export type AdminCatalogDto = {
    categories: AdminCategoryDto[];
    questions: AdminQuestionDto[];
    options: AdminOptionDto[];
};

export type AdminCategoryDto = {
    id: number;
    key: "MaterialsManufacturing" | "Transport";
    label: string;
    order: number;
    isActive: boolean;
};

export type AdminQuestionDto = {
    id: number;
    categoryId: number;
    categoryKey: string;
    key: string;
    label: string;
    order: number;
    answerType: "Single" | "Multiple";
    isActive: boolean;
};

export type AdminOptionDto = {
    id: number;
    questionId: number;
    questionKey: string;
    key: string;
    label: string;
    order: number;
    score: number;
    isActive: boolean;
};

export type AdminUpsertCatalogRequest = {
    categories: UpsertCategoryDto[];
    questions: UpsertQuestionDto[];
    options: UpsertOptionDto[];
};

export type UpsertCategoryDto = {
    id: number | null;
    key: "MaterialsManufacturing" | "Transport";
    label: string;
    order: number;
    isActive: boolean;
};

export type UpsertQuestionDto = {
    id: number | null;
    categoryKey: string;
    key: string;
    label: string;
    order: number;
    answerType: "Single" | "Multiple";
    isActive: boolean;
};

export type UpsertOptionDto = {
    id: number | null;
    questionKey: string;
    key: string;
    label: string;
    order: number;
    score: number;
    isActive: boolean;
};