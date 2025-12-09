import axiosInstance from "@/api/api";
import {TAGS_ROUTES} from "./routes";

export const ethicsService = {
    /**
     * Récupère tous les tags éthiques disponibles
     * Endpoint : GET /ethics/tags
     */
    getEthicTags: async () => {
        const response = await axiosInstance.get(TAGS_ROUTES.tags);
        return response.data;
    }
};