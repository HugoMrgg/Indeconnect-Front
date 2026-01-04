import axiosInstance from "@/api/api";
import { logger } from "@/utils/logger";

export interface RecommendedProduct {
    id: number;
    name: string;
    imageUrl: string | null;
    basePrice: number;
    salePrice: number | null;
    description: string;
    averageRating: number;
    reviewsCount: number;
    brandName: string | null;
    categoryName: string | null;
    colorName: string | null;
    recommendationScore: number;
    recommendationReason: string;
}

/**
 * Récupère des produits similaires basés sur l'historique d'achat de l'utilisateur
 */
export async function fetchSimilarProducts(
    userId: number,
    limit: number = 10
): Promise<RecommendedProduct[]> {
    try {
        const response = await axiosInstance.get<RecommendedProduct[]>(
            `/recommendations/similar/${userId}`,
            { params: { limit } }
        );
        return response.data;
    } catch (error) {
        logger.error("RecommendationsService.fetchSimilarProducts", error);
        throw error;
    }
}

/**
 * Récupère des produits fréquemment achetés ensemble avec le produit spécifié
 */
export async function fetchFrequentlyBoughtTogether(
    productId: number,
    limit: number = 5
): Promise<RecommendedProduct[]> {
    try {
        const response = await axiosInstance.get<RecommendedProduct[]>(
            `/recommendations/frequently-bought-together/${productId}`,
            { params: { limit } }
        );
        return response.data;
    } catch (error) {
        logger.error("RecommendationsService.fetchFrequentlyBoughtTogether", error);
        throw error;
    }
}
