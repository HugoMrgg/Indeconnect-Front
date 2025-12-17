import axiosInstance from "@/api/api";
import {ETHICS_ROUTES} from "./routes";

export const ethicsService = {
    /**
     * Récupère tous les tags éthiques disponibles
     * Endpoint : GET /ethics/tags
     */
    getEthicTags: async () => {
        const response = await axiosInstance.get(ETHICS_ROUTES.tags);
        return response.data;
    }
};