import axiosInstance from "@/api/api";
import { logger } from "@/utils/logger";

export interface SizeDto {
    id: number;
    name: string;
    categoryId: number;
    sortOrder: number;
}

/**
 * Fetch sizes by category ID
 */
export async function fetchSizesByCategory(categoryId: number): Promise<SizeDto[]> {
    try {
        const response = await axiosInstance.get<SizeDto[]>(`/sizes/category/${categoryId}`);
        return response.data;
    } catch (error) {
        logger.error("SizesService.fetchSizesByCategory", error);
        throw error;
    }
}

/**
 * Fetch all sizes (optional - pour debug)
 */
export async function fetchAllSizes(): Promise<SizeDto[]> {
    try {
        const response = await axiosInstance.get<SizeDto[]>("/sizes");
        return response.data;
    } catch (error) {
        logger.error("SizesService.fetchAllSizes", error);
        throw error;
    }
}
