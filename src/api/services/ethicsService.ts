import axiosInstance from "@/api/api";

export const ethicsService = {
    /**
     * Récupère tous les tags éthiques disponibles
     * Endpoint : GET /ethics/tags
     */
    getEthicTags: async () => {
        const response = await axiosInstance.get("/ethics/tags");
        return response.data; // EthicTagsListResponse { tags: EthicTag[] }
    }
};
