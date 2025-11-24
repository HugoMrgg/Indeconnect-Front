import axiosInstance from "@/api/api";
import {BRANDS_ROUTES} from "@/api/services/brands/routes";

export const brandsService = {
    getBrands: async (params?: any) => {
        // params peut contenir des filtres (tri, pagination, etc)
        const response = await axiosInstance.get(BRANDS_ROUTES.all, { params });
        return response.data; // c'est la BrandsListResponse
    },
    getBrandById: async (brandId: number) => {
        const response = await axiosInstance.get(BRANDS_ROUTES.byId(brandId));
        return response.data; // c'est le BrandDetailDto
    }
};