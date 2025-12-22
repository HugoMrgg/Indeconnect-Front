import axiosInstance from "@/api/api";
import {ETHICS_ROUTES} from "../routes";
import {EthicsFormDto, UpsertQuestionnaireRequest} from "@/api/services/ethics/superVendor/types";

export const EthicsSuperVendorQuestionnaireService = {
    getMyForm: async () => {
        const { data } = await axiosInstance.get<EthicsFormDto>(ETHICS_ROUTES.getMyForm);
        return data;
    },

    upsertMyForm: async (payload: UpsertQuestionnaireRequest) => {
        const { data } = await axiosInstance.put<EthicsFormDto>(ETHICS_ROUTES.saveMyForm, payload);
        return data;
    },
};