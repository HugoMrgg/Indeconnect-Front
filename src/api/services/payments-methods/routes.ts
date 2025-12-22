export const PAYMENT_METHODS_ROUTES = {
    mine: "/me/payment-methods",
    byId: (paymentMethodId: string) => `/me/payment-methods/${encodeURIComponent(paymentMethodId)}`,
    setDefault: (paymentMethodId: string) => `/me/payment-methods/${encodeURIComponent(paymentMethodId)}/default`,
    setupIntent: "/me/payment-methods/setup-intent",
} as const;
