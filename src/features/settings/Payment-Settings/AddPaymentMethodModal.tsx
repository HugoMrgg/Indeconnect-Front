import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { paymentMethodsService } from "@/api/services/payments-methods";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type Props = {
    open: boolean;
    onClose: () => void;
    onAdded: () => void; // refetch list
};

export const AddPaymentMethodModal: React.FC<Props> = ({ open, onClose, onAdded }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setClientSecret(null);
            return;
        }

        if (!stripePromise) {
            toast.error("Stripe publishable key manquante (VITE_STRIPE_PUBLISHABLE_KEY).");
            onClose();
            return;
        }

        (async () => {
            setLoading(true);
            try {
                const secret = await paymentMethodsService.createSetupIntent();
                setClientSecret(secret);
            } catch (e: unknown) {
                toast.error((e as Error)?.message ?? "Impossible de démarrer l'ajout de carte");
                onClose();
            } finally {
                setLoading(false);
            }
        })();
    }, [open, onClose]);

    const options = useMemo(() => {
        if (!clientSecret) return undefined;
        return {
            clientSecret,
            paymentMethodOrder: ["card"],
        };
    }, [clientSecret]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Container scroll-safe */}
            <div className="relative h-full w-full overflow-y-auto px-4 py-6">
                <div className="mx-auto w-full max-w-lg">
                    {/* Modal */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Ajouter une carte</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    La carte est enregistrée chez Stripe (promis, sans lasers).
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-900"
                                aria-label="Fermer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body (scrollable) */}
                        <div className="p-6 overflow-y-auto">
                            {loading || !options || !stripePromise ? (
                                <div className="py-10 text-center text-gray-500 animate-pulse">
                                    Préparation Stripe…
                                </div>
                            ) : (
                                <Elements stripe={stripePromise} options={options}>
                                    <AddPaymentMethodForm
                                        onSuccess={() => {
                                            toast.success("Carte enregistrée ✅");
                                            onAdded();
                                            onClose();
                                        }}
                                    />
                                </Elements>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
