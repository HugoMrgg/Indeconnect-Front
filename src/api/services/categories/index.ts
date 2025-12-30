import axiosInstance from "@/api/api";

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
        console.error("Error fetching Categories:", error);
        throw error;
    }
}
