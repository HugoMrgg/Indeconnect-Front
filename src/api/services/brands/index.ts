import axiosInstance from "@/api/api";
import { BRANDS_ROUTES } from "@/api/services/brands/routes";
import {
    BrandsListResponse,
    BrandDetailDTO,
    BrandsQueryParams,
    UpdateBrandRequest
} from "@/api/services/brands/types";

export const brandsService = {
    getBrands: async (params?: BrandsQueryParams): Promise<BrandsListResponse> => {
        const response = await axiosInstance.get<BrandsListResponse>(
            BRANDS_ROUTES.all,
            { params }
        );
        return response.data;
    },

    getBrandById: async (
        brandId: number,
        lat?: number,
        lon?: number
    ): Promise<BrandDetailDTO> => {
        const response = await axiosInstance.get<BrandDetailDTO>(
            BRANDS_ROUTES.byId(brandId),
            {
                params: { lat, lon }
            }
        );
        return response.data;
    },

    getMyBrand: async (): Promise<BrandDetailDTO> => {
        const response = await axiosInstance.get<BrandDetailDTO>(
            BRANDS_ROUTES.myBrand
        );
        return response.data;
    },

    updateBrand: async (
        brandId: number,
        data: UpdateBrandRequest
    ): Promise<void> => {
        await axiosInstance.put(BRANDS_ROUTES.update(brandId), data);
    }
};