import { useEffect, useState, useRef, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { usePayment } from "@/hooks/Payment/usePayment";
import { Loader2, AlertCircle, CreditCard, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type PaymentSectionProps = {
    orderId: number;
    onPaymentSuccess: () => void;
};

export function PaymentSection({ orderId, onPaymentSuccess }: PaymentSectionProps) {
    const { createIntent } = usePayment();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const hasCalledRef = useRef(false);

    useEffect(() => {
        if (!orderId || hasCalledRef.current) return;
        hasCalledRef.current = true;

        createIntent({ orderId })
            .then((response) => {
                if (response?.clientSecret) {
                    setClientSecret(response.clientSecret);
                } else {
                    setError("Impossible de créer le paiement");
                }
            })
            .catch((err: unknown) => {
                const message = err instanceof Error
                    ? err.message
                    : "Erreur de création du paiement";
                setError(message);
                hasCalledRef.current = false;
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                        <p className="text-red-800 font-medium mb-1">Erreur de paiement</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setError(null);
                        hasCalledRef.current = false;
                        window.location.reload();
                    }}
                    className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <Loader2 className="animate-spin text-gray-600 mb-3" size={32} />
                <p className="text-sm text-gray-600">Initialisation du paiement...</p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#000000',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        colorDanger: '#ef4444',
                        fontFamily: 'system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px',
                    },
                },
            }}
        >
            <PaymentForm orderId={orderId} onSuccess={onPaymentSuccess} />
        </Elements>
    );
}

function PaymentForm({ orderId, onSuccess }: { orderId: number; onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const { confirm } = usePayment();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError("Stripe n'est pas encore chargé. Veuillez réessayer.");
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/orders/${orderId}/confirmation`,
                },
                redirect: "if_required",
            });

            if (stripeError) {
                setError(stripeError.message || "Erreur lors du paiement");
                setProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                const result = await confirm({
                    orderId,
                    paymentIntentId: paymentIntent.id,
                });

                if (result?.success) {
                    onSuccess();
                } else {
                    setError("Erreur lors de la validation du paiement. Contactez le support.");
                }
            } else {
                setError("Le paiement n'a pas abouti. Veuillez réessayer.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error
                ? err.message
                : "Une erreur inattendue est survenue";
            setError(message);
        } finally {
            setProcessing(false);
        }
    }, [stripe, elements, orderId, confirm, onSuccess]);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* En-tête avec icône */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <CreditCard className="text-blue-600" size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Informations de paiement</h3>
                    <p className="text-sm text-gray-600">Entrez vos coordonnées bancaires</p>
                </div>
            </div>

            {/* Payment Element avec style amélioré */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <PaymentElement
                    options={{
                        layout: {
                            type: 'accordion',
                            defaultCollapsed: false,
                            radios: true,
                            spacedAccordionItems: true,
                        },
                    }}
                />
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3 animate-in fade-in duration-200">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium mb-1">Erreur de paiement</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Badges de sécurité */}
            <div className="flex items-center justify-center gap-6 py-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-800">
                    <ShieldCheck size={18} className="text-green-600" />
                    <span className="font-medium">Paiement sécurisé SSL</span>
                </div>
                <div className="h-4 w-px bg-green-300"></div>
                <div className="flex items-center gap-2">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                        alt="Stripe"
                        className="h-5 opacity-70"
                    />
                </div>
            </div>

            {/* Bouton de soumission */}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Traitement du paiement...</span>
                    </>
                ) : (
                    <>
                        <ShieldCheck size={20} />
                        <span>Finaliser le paiement</span>
                    </>
                )}
            </button>

            {/* Note de sécurité */}
            <p className="text-xs text-center text-gray-500 leading-relaxed">
                Vos informations bancaires sont cryptées et sécurisées.<br />
                Aucune donnée de carte n'est stockée sur nos serveurs.
            </p>
        </form>
    );
}