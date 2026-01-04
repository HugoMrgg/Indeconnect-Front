import axiosInstance from "@/api/api";
import { logger } from "@/utils/logger";

export interface ColorDto {
    id: number;
    name: string;
    hexa: string;
}

/**
 * Fetch all available colors
 */
export async function fetchColors(): Promise<ColorDto[]> {
    try {
        const response = await axiosInstance.get<ColorDto[]>("/colors");
        return response.data;
    } catch (error) {
        logger.error("ColorService.fetchColors", error);
        throw error;
    }
}
