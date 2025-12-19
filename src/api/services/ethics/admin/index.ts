import axiosInstance from "@/api/api";
import {ETHICS_ROUTES} from "../routes";
import {AdminCatalogDto, AdminUpsertCatalogRequest} from "@/api/services/ethics/admin/types";
import { sanitizeAdminCatalog } from "@/api/services/ethics/admin/sanitizeAdminCatalog";

export const EthicsAdminCatalogService = {

    getCatalog: async () => {
        const { data } = await axiosInstance.get<AdminCatalogDto>(ETHICS_ROUTES.getAdminCatalog);
        return data;
    },

    upsertCatalog: async (payload: AdminUpsertCatalogRequest) => {
        const safe = sanitizeAdminCatalog(payload);
        const { data } = await axiosInstance.put<AdminCatalogDto>(ETHICS_ROUTES.saveAdminCatalog, safe);
        return data;
    },
};