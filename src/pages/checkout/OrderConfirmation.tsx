import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { usePayment } from "@/hooks/Payment/usePayment";
import toast from "react-hot-toast";

export function OrderConfirmation() {
    const { t } = useTranslation();
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { confirm } = usePayment();
    const [loading, setLoading] = useState(true);
    const hasConfirmedRef = useRef(false);

    useEffect(() => {
        if (hasConfirmedRef.current) return;

        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId = urlParams.get("payment_intent");
        const redirectStatus = urlParams.get("redirect_status");

        if (!paymentIntentId || !orderId) {
            if (!hasConfirmedRef.current) {
                hasConfirmedRef.current = true;
                toast.error("Paramètres de paiement manquants");
                navigate("/");
            }
            return;
        }

        if (redirectStatus === "succeeded") {
            hasConfirmedRef.current = true;

            confirm({
                orderId: parseInt(orderId),
                paymentIntentId,
            })
                .then((result) => {
                    if (result?.success) {
                        toast.success("Paiement confirmé ! 🎉");
                        navigate(`/orders/${orderId}`);
                    } else {
                        toast.error("Erreur lors de la confirmation");
                        setLoading(false);
                        hasConfirmedRef.current = false;
                    }
                })
                .catch(() => {
                    toast.error("Erreur de traitement");
                    setLoading(false);
                    hasConfirmedRef.current = false;
                });
        } else {
            hasConfirmedRef.current = true;
            toast.error("Le paiement a échoué");
            navigate("/checkout");
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return null;
}
