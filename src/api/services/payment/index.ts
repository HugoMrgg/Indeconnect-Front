import api from "@/api/api";
import { PAYMENT_ROUTES } from "./routes";
import {
    CreatePaymentIntentDto,
    PaymentIntentDto,
    ConfirmPaymentDto,
    PaymentConfirmationDto,
} from "./types";

/**
 * Crée un PaymentIntent Stripe pour une commande
 */
export async function createPaymentIntent(
    data: CreatePaymentIntentDto
): Promise<PaymentIntentDto> {
    const response = await api.post(PAYMENT_ROUTES.createIntent(), data);
    return response.data;
}

/**
 * Confirme le paiement après validation Stripe
 */
export async function confirmPayment(
    data: ConfirmPaymentDto
): Promise<PaymentConfirmationDto> {
    const response = await api.post(PAYMENT_ROUTES.confirmPayment(), data);
    return response.data;
}
