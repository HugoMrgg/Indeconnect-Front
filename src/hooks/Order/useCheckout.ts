import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShippingChoice } from "@/types/checkout";
import { useOrder } from "@/hooks/Order/useOrder";
import toast from "react-hot-toast";

/**
 * Hook orchestrateur pour le processus de checkout
 * Gère : sélection d'adresse, méthodes de livraison, création commande
 * Note: Le paiement est géré séparément dans PaymentSection via usePayment
 */
export function useCheckout() {
    const navigate = useNavigate();
    const { create: createOrder } = useOrder();

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [shippingChoices, setShippingChoices] = useState<Map<number, ShippingChoice>>(new Map());
    const [orderId, setOrderId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    // Validation : toutes les marques ont une méthode de livraison
    const allBrandsHaveMethod = useCallback(
        (brandIds: number[]) => {
            return brandIds.every((brandId) => shippingChoices.has(brandId));
        },
        [shippingChoices]
    );

    // Peut procéder au checkout ?
    const canProceed = useMemo(() => {
        return selectedAddressId !== null && shippingChoices.size > 0;
    }, [selectedAddressId, shippingChoices.size]);

    // Sélectionner une adresse
    const selectAddress = useCallback((addressId: number | null) => {
        setSelectedAddressId(addressId);
    }, []);

    // Sélectionner une méthode de livraison pour une marque
    const selectShippingMethod = useCallback(
        (brandId: number, methodId: number, price: number, displayName: string) => {
            setShippingChoices((prev) => {
                const updated = new Map(prev);
                updated.set(brandId, { brandId, methodId, price, displayName });
                return updated;
            });
        },
        []
    );

    // Créer la commande
    const handleCreateOrder = useCallback(async () => {
        if (!canProceed || !selectedAddressId) {
            toast.error("Veuillez compléter toutes les informations de livraison");
            return null;
        }

        setProcessing(true);

        try {
            const deliveryChoices = Array.from(shippingChoices.values()).map((choice) => ({
                brandId: choice.brandId,
                shippingMethodId: choice.methodId,
            }));

            const order = await createOrder({
                shippingAddressId: selectedAddressId,
                deliveryChoices,
            });

            if (order) {
                setOrderId(order.id);
                return order.id;
            }

            return null;
        } catch (error: unknown) {
            console.error("[useCheckout] handleCreateOrder error:", error);
            return null;
        } finally {
            setProcessing(false);
        }
    }, [canProceed, selectedAddressId, shippingChoices, createOrder]);

    // Finaliser le paiement
    const handlePaymentSuccess = useCallback(() => {
        if (!orderId) return;

        toast.success("Paiement confirmé ! 🎉");
        navigate(`/orders/${orderId}`);
    }, [orderId, navigate]);

    // Réinitialiser le checkout
    const reset = useCallback(() => {
        setSelectedAddressId(null);
        setShippingChoices(new Map());
        setOrderId(null);
        setProcessing(false);
    }, []);

    return {
        // États
        selectedAddressId,
        shippingChoices,
        orderId,
        processing,
        canProceed,

        // Actions
        selectAddress,
        selectShippingMethod,
        handleCreateOrder,
        handlePaymentSuccess,
        reset,

        // Utilitaires
        allBrandsHaveMethod,
    };
}