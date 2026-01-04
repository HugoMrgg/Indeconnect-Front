import axiosInstance from "@/api/api";
import { ETHICS_ROUTES } from "../routes";
import type { AdminCatalogDto, AdminUpsertCatalogRequest } from "./types";

export const EthicsAdminCatalogService = {
    getCatalog: async () => {
        const { data } = await axiosInstance.get<AdminCatalogDto>(ETHICS_ROUTES.getAdminCatalog);
        return data;
    },

    upsertCatalog: async (payload: AdminUpsertCatalogRequest) => {
        const { data } = await axiosInstance.put<AdminCatalogDto>(ETHICS_ROUTES.saveAdminCatalog, payload);
        return data;
    },

    publishDraft: async () => {
        const { data } = await axiosInstance.post(ETHICS_ROUTES.publishCatalog);
        return data;
    },
};
