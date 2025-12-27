import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/api/errors";
import { ModeratorReviewsService } from "@/api/services/reviews/moderator";
import {PagedResult, ProductReviewDto, ReviewStatus} from "@/api/services/reviews/moderator/type";


type Filters = {
    status: ReviewStatus;
    productId: number | null;
    page: number;
    pageSize: number;
};

const normalize = (data: PagedResult<ProductReviewDto> | ProductReviewDto[], fallback: Filters) => {
    if (Array.isArray(data)) {
        return {
            items: data,
            page: fallback.page,
            pageSize: fallback.pageSize,
            total: data.length,
        } satisfies PagedResult<ProductReviewDto>;
    }
    return data;
};

export function useModeratorReviews() {
    const [filters, setFilters] = useState<Filters>({
        status: "Enabled",
        productId: null,
        page: 1,
        pageSize: 20,
    });

    const [data, setData] = useState<PagedResult<ProductReviewDto>>({
        items: [],
        page: 1,
        pageSize: 20,
        total: 0,
    });

    const [loading, setLoading] = useState(false);
    const [actingId, setActingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil((data.total ?? 0) / (data.pageSize ?? 20)));
    }, [data.total, data.pageSize]);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await ModeratorReviewsService.getAll({
                status: filters.status,
                productId: filters.productId ?? undefined,
                page: filters.page,
                pageSize: filters.pageSize,
            });

            setData(normalize(res, filters));
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors du chargement des reviews.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const approve = useCallback(async (reviewId: number) => {
        setActingId(reviewId);
        try {
            await ModeratorReviewsService.approve(reviewId);
            toast.success("Review approuvée ✅");
            // update local optimiste
            setData(prev => ({
                ...prev,
                items: prev.items.map(r => (r.id === reviewId ? { ...r, status: "Enabled" } : r)),
            }));
            // si tu es en filtre Disabled, tu peux la retirer visuellement :
            if (filters.status === "Disabled") {
                setData(prev => ({ ...prev, items: prev.items.filter(r => r.id !== reviewId) }));
            }
        } catch (e) {
            toast.error(e instanceof ApiError ? e.message : "Impossible d’approuver la review.");
        } finally {
            setActingId(null);
        }
    }, [filters.status]);

    const reject = useCallback(async (reviewId: number) => {
        setActingId(reviewId);
        try {
            await ModeratorReviewsService.reject(reviewId);
            toast.success("Review rejetée ❌");
            setData(prev => ({
                ...prev,
                items: prev.items.map(r => (r.id === reviewId ? { ...r, status: "Disabled" } : r)),
            }));
            if (filters.status === "Enabled") {
                setData(prev => ({ ...prev, items: prev.items.filter(r => r.id !== reviewId) }));
            }
        } catch (e) {
            toast.error(e instanceof ApiError ? e.message : "Impossible de rejeter la review.");
        } finally {
            setActingId(null);
        }
    }, [filters.status]);

    return {
        filters,
        setFilters,
        data,
        loading,
        actingId,
        error,
        totalPages,
        refetch,
        approve,
        reject,
    };
}
