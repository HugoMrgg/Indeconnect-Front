import axiosInstance from "@/api/api";
import { ETHICS_ROUTES } from "../routes";
import type { EthicsFormDto, UpsertQuestionnaireRequest } from "./types";

export const EthicsSuperVendorQuestionnaireService = {
    getMyForm: async () => {
        const { data } = await axiosInstance.get<EthicsFormDto>(ETHICS_ROUTES.getMyForm);
        return data;
    },

    upsertMyForm: async (payload: UpsertQuestionnaireRequest) => {
        const { data } = await axiosInstance.put<EthicsFormDto>(ETHICS_ROUTES.saveMyForm, payload);
        return data;
    },

    markAsReviewed: async () => {
        await axiosInstance.post(ETHICS_ROUTES.markReviewed);
    },
};
