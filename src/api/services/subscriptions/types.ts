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
