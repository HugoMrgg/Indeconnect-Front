import axiosInstance from "@/api/api";
import { logger } from "@/utils/logger";

export interface CategoryDto {
    id: number;
    name: string;
}

/**
 * Fetch all available Categories
 */
export async function fetchCategories(): Promise<CategoryDto[]> {
    try {
        const response = await axiosInstance.get<CategoryDto[]>("/categories");
        return response.data;
    } catch (error) {
        logger.error("CategoryService.fetchCategories", error);
        throw error;
    }
}
