export const ORDER_ROUTES = {
    createOrder: () => `/orders`,
    getOrder: (orderId: number) => `/orders/${orderId}`,
    getUserOrders: (userId: number) => `/orders/users/${userId}`,
} as const;
