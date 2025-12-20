export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export type ProductReviewDto = {
    id: number;
    userId: number;
    userName: string; // back te renvoie "FirstName LastName" concat
    rating: number;   // 1..5
    comment: string | null;
    createdAt: string; // ISO
    status: ReviewStatus;
    // bonus utile en modération
    productId?: number; // si ton back l’ajoute (optionnel)
    productName?: string; // si ton back l’ajoute (optionnel)
};

export type PagedResult<T> = {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
};
