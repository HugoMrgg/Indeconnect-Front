import axiosInstance from "@/api/api";

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
        console.error("Error fetching sizes:", error);
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
        console.error("Error fetching all sizes:", error);
        throw error;
    }
}
