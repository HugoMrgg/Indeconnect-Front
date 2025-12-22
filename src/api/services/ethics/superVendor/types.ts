export type QuestionnaireStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export type EthicsFormDto = {
    questionnaireId: number | null;
    status: QuestionnaireStatus;
    categories: EthicsCategoryDto[];
};

export type EthicsCategoryDto = {
    id: number;
    key: string;
    label: string;
    order: number;
    questions: EthicsQuestionDto[];
};

export type EthicsQuestionDto = {
    id: number;
    key: string;
    label: string;
    order: number;
    answerType: "Single" | "Multiple";
    options: EthicsOptionDto[];
    selectedOptionIds: number[]; // utile côté remplissage marque, peut rester []
};

export type EthicsOptionDto = {
    id: number;
    key: string;
    label: string;
    order: number;
    score: number;
};

export type UpsertQuestionnaireRequest = {
    submit: boolean;
    answers: QuestionAnswerDto[];
};

export type QuestionAnswerDto = {
    questionId: number;
    optionIds: number[];
};