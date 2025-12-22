export type CreatePaymentIntentDto = {
    orderId: number;
};

export type PaymentIntentDto = {
    clientSecret: string;
    orderId: number;
    amount: number;
    currency: string;
};

export type ConfirmPaymentDto = {
    orderId: number;
    paymentIntentId: string;
};

export type PaymentConfirmationDto = {
    success: boolean;
    orderId: number;
    paymentStatus: string;
};
