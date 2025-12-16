export const ORDER_ROUTES = {
    createOrder: () => `/orders`,
    getOrder: (orderId: number) => `/orders/${orderId}`,
    getUserOrders: (userId: number) => `/orders/users/${userId}`,
    getTracking: (orderId: number) => `/orders/${orderId}/tracking`, // 🆕 AJOUTER
} as const;
