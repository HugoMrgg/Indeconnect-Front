import axiosInstance from "@/api/api";

export interface CreateBrandSubscriptionRequest {
    brandId: number;
}

export interface BrandSubscriptionResponse {
    id: number;
    userId: number;
    brandId: number;
    brandName: string;
    subscribedAt: string;
}

export interface BrandSubscriptionItem {
    brandId: number;
    brandName: string;
    logoUrl?: string;
    subscribedAt: string;
}

export interface UserBrandSubscriptionsResponse {
    userId: number;
    subscriptions: BrandSubscriptionItem[];
}

export const BrandSubscriptionService = {
    /**
     * S'abonner à une marque
     */
    subscribe: async (brandId: number): Promise<BrandSubscriptionResponse> => {
        const response = await axiosInstance.post<BrandSubscriptionResponse>(
            "/brandSubscriptions",
            { brandId }
        );
        return response.data;
    },

    /**
     * Se désabonner d'une marque
     */
    unsubscribe: async (brandId: number): Promise<void> => {
        await axiosInstance.delete(`/brandSubscriptions/${brandId}`);
    },

    /**
     * Récupérer tous les abonnements de l'utilisateur
     */
    getUserSubscriptions: async (): Promise<UserBrandSubscriptionsResponse> => {
        const response = await axiosInstance.get<UserBrandSubscriptionsResponse>(
            "/brandSubscriptions"
        );
        return response.data;
    },

    /**
     * Vérifier si l'utilisateur est abonné à une marque
     */
    isSubscribed: async (brandId: number): Promise<boolean> => {
        try {
            const subs = await BrandSubscriptionService.getUserSubscriptions();
            return subs.subscriptions.some(s => s.brandId === brandId);
        } catch {
            return false;
        }
    },
};
