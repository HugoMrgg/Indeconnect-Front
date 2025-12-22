export const MODERATOR_REVIEW_ROUTES = {
    list: "/moderator/reviews",
    approve: (reviewId: number) => `/moderator/reviews/${reviewId}/approve`,
    reject: (reviewId: number) => `/moderator/reviews/${reviewId}/reject`,
};
