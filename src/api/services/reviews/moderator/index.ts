import axiosInstance from "@/api/api";
import { MODERATOR_REVIEW_ROUTES } from "./routes";
import {PagedResult, ProductReviewDto, ReviewStatus} from "@/api/services/reviews/moderator/type";


type GetReviewsParams = {
    status?: ReviewStatus;
    productId?: number | null;
    page?: number;
    pageSize?: number;
};

export const ModeratorReviewsService = {
    getAll: async (params: GetReviewsParams) => {
        const { data } = await axiosInstance.get<PagedResult<ProductReviewDto> | ProductReviewDto[]>(
            MODERATOR_REVIEW_ROUTES.list,
            { params }
        );
        return data;
    },

    approve: async (reviewId: number) => {
        await axiosInstance.post(MODERATOR_REVIEW_ROUTES.approve(reviewId));
    },

    reject: async (reviewId: number) => {
        await axiosInstance.post(MODERATOR_REVIEW_ROUTES.reject(reviewId));
    },
};
