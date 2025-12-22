import React, { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export const AddPaymentMethodForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!stripe || !elements) return;

        setSubmitting(true);
        try {
            const { error } = await stripe.confirmSetup({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/settings/payments`, // adapte si besoin
                },
                redirect: "if_required",
            });

            if (error) {
                setError(error.message ?? "Erreur Stripe");
                return;
            }

            onSuccess();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-4">
                <PaymentElement />
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || submitting}
                className="w-full px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
                {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
        </form>
    );
};
