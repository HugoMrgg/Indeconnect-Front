export const PAYMENT_ROUTES = {
    createIntent: () => `/payments/create-intent`,
    confirmPayment: () => `/payments/confirm`,
} as const;
