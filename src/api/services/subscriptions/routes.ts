import axiosInstance from "@/api/api";
import {
    BrandSubscriptionResponse,
    UserBrandSubscriptionsResponse,
} from "./types";

/**
 * S'abonner à une marque
 */
export async function subscribe(brandId: number): Promise<BrandSubscriptionResponse> {
    const response = await axiosInstance.post<BrandSubscriptionResponse>(
        "/brandSubscriptions",
        { brandId }
    );
    return response.data;
}

/**
 * Se désabonner d'une marque
 */
export async function unsubscribe(brandId: number): Promise<void> {
    await axiosInstance.delete(`/brandSubscriptions/${brandId}`);
}

/**
 * Récupérer tous les abonnements de l'utilisateur
 */
export async function getUserSubscriptions(): Promise<UserBrandSubscriptionsResponse> {
    const response = await axiosInstance.get<UserBrandSubscriptionsResponse>(
        "/brandSubscriptions"
    );
    return response.data;
}

/**
 * Vérifier si l'utilisateur est abonné à une marque
 */
export async function isSubscribed(brandId: number): Promise<boolean> {
    try {
        const subs = await getUserSubscriptions();
        return subs.subscriptions.some(s => s.brandId === brandId);
    } catch {
        return false;
    }
}
