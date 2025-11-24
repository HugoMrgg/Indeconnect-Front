import axiosInstance from "@/api/api";

export const brandsService = {
    getBrands: async (params?: any) => {
        // params peut contenir des filtres (tri, pagination, etc)
        const response = await axiosInstance.get("/brands", { params });
        return response.data; // c'est la BrandsListResponse
    },
    getBrandById: async (brandId: number) => {
        const response = await axiosInstance.get(`/brands/${brandId}`);
        return response.data; // c'est le BrandDetailDto
    }
};
