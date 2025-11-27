export interface WishlistItem {
    productId: number;
    productName: string;
    description: string;
    price: number;
    brandName: string;
    categoryId: number;
    primaryImageUrl: string;
    hasStock: boolean;
    addedAt: string;
    primaryColor: {
        id: number;
        name: string;
        hexa: string;
    };
}

export interface WishlistResponse {
    id: number;
    userId: number;
    items: WishlistItem[];
    totalItems: number;
}