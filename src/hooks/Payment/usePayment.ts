import { useState, useCallback } from "react";
import { createPaymentIntent, confirmPayment } from "@/api/services/payment";
import {
    CreatePaymentIntentDto,
    PaymentIntentDto,
    ConfirmPaymentDto,
    PaymentConfirmationDto,
} from "@/api/services/payment/types";
import { extractErrorMessage } from "@/utils/errorHandling";

export function usePayment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createIntent = useCallback(async (
        data: CreatePaymentIntentDto
    ): Promise<PaymentIntentDto | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await createPaymentIntent(data);
            return response;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[usePayment] createIntent error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const confirm = useCallback(async (
        data: ConfirmPaymentDto
    ): Promise<PaymentConfirmationDto | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await confirmPayment(data);
            return response;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[usePayment] confirm error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createIntent,
        confirm,
    };
}