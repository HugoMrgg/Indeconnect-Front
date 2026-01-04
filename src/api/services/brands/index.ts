import axiosInstance from "@/api/api";
import { BRANDS_ROUTES } from "@/api/services/brands/routes";
import {
    BrandsListResponse,
    BrandDetailDTO,
    BrandsQueryParams,
    UpdateBrandRequest, UpsertBrandDepositRequest, DepositDTO, BecomeBrandRequestPayload, BrandModerationListDTO,
    BrandModerationDetailDTO,
    BrandsModerationListResponse
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
    },

    upsertMyBrandDeposit: async (
        data: UpsertBrandDepositRequest
    ): Promise<DepositDTO> => {
        const response = await axiosInstance.put<DepositDTO>(
            "/brands/my-brand/deposit",
            data
        );
        return response.data;
    },

    request: async (data: BecomeBrandRequestPayload): Promise<void> => {
        await axiosInstance.post(BRANDS_ROUTES.request, data);
    },
    submitBrand: async (brandId: number): Promise<void> => {
        await axiosInstance.post(BRANDS_ROUTES.submit(brandId));
    },

    // ➕ NOUVEAU - Modération Moderator
    getBrandsForModeration: async (page: number = 1, pageSize: number = 10): Promise<BrandsModerationListResponse> => {
        const response = await axiosInstance.get<BrandsModerationListResponse>(
            BRANDS_ROUTES.moderation,
            { params: { page, pageSize } }
        );
        return response.data;
    },
    getBrandForModeration: async (brandId: number): Promise<BrandModerationDetailDTO> => {
        const response = await axiosInstance.get<BrandModerationDetailDTO>(
            BRANDS_ROUTES.moderationDetail(brandId)
        );
        return response.data;
    },

    approveBrand: async (brandId: number): Promise<void> => {
        await axiosInstance.post(BRANDS_ROUTES.approve(brandId));
    },

    rejectBrand: async (brandId: number, reason: string): Promise<void> => {
        await axiosInstance.post(BRANDS_ROUTES.reject(brandId), { reason });
    },
};