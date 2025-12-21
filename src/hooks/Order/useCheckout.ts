import { useReducer, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShippingChoice } from "@/types/checkout";
import { useOrder } from "@/hooks/Order/useOrder";
import toast from "react-hot-toast";

/**
 * Hook orchestrateur pour le processus de checkout
 * Gère : sélection d'adresse, méthodes de livraison, création commande
 * Note: Le paiement est géré séparément dans PaymentSection via usePayment
 */

// State type
interface CheckoutState {
    selectedAddressId: number | null;
    shippingChoices: Map<number, ShippingChoice>;
    orderId: number | null;
    processing: boolean;
}

// Action types
type CheckoutAction =
    | { type: "SELECT_ADDRESS"; payload: number | null }
    | { type: "SET_SHIPPING_METHOD"; payload: ShippingChoice }
    | { type: "CLEAR_SHIPPING_CHOICES" }
    | { type: "CREATE_ORDER_START" }
    | { type: "CREATE_ORDER_SUCCESS"; payload: number }
    | { type: "CREATE_ORDER_FAILURE" }
    | { type: "RESET" };

// Initial state
const initialState: CheckoutState = {
    selectedAddressId: null,
    shippingChoices: new Map(),
    orderId: null,
    processing: false,
};

// Reducer
function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
    switch (action.type) {
        case "SELECT_ADDRESS":
            return {
                ...state,
                selectedAddressId: action.payload,
                // Clear shipping choices when address changes
                shippingChoices: new Map(),
            };

        case "SET_SHIPPING_METHOD": {
            const newChoices = new Map(state.shippingChoices);
            newChoices.set(action.payload.brandId, action.payload);
            return {
                ...state,
                shippingChoices: newChoices,
            };
        }

        case "CLEAR_SHIPPING_CHOICES":
            return {
                ...state,
                shippingChoices: new Map(),
            };

        case "CREATE_ORDER_START":
            return {
                ...state,
                processing: true,
            };

        case "CREATE_ORDER_SUCCESS":
            return {
                ...state,
                orderId: action.payload,
                processing: false,
            };

        case "CREATE_ORDER_FAILURE":
            return {
                ...state,
                processing: false,
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

export function useCheckout() {
    const navigate = useNavigate();
    const { create: createOrder } = useOrder();

    const [state, dispatch] = useReducer(checkoutReducer, initialState);

    // Validation : toutes les marques ont une méthode de livraison
    const allBrandsHaveMethod = useCallback(
        (brandIds: number[]) => {
            return brandIds.every((brandId) => state.shippingChoices.has(brandId));
        },
        [state.shippingChoices]
    );

    // Peut procéder au checkout ?
    const canProceed = useMemo(() => {
        return state.selectedAddressId !== null && state.shippingChoices.size > 0;
    }, [state.selectedAddressId, state.shippingChoices.size]);

    // Sélectionner une adresse
    const selectAddress = useCallback((addressId: number | null) => {
        dispatch({ type: "SELECT_ADDRESS", payload: addressId });
    }, []);

    // Sélectionner une méthode de livraison pour une marque
    const selectShippingMethod = useCallback(
        (brandId: number, methodId: number, price: number, displayName: string) => {
            dispatch({
                type: "SET_SHIPPING_METHOD",
                payload: { brandId, methodId, price, displayName },
            });
        },
        []
    );

    // Créer la commande
    const handleCreateOrder = useCallback(async () => {
        if (!canProceed || !state.selectedAddressId) {
            toast.error("Veuillez compléter toutes les informations de livraison");
            return null;
        }

        dispatch({ type: "CREATE_ORDER_START" });

        try {
            const deliveryChoices = Array.from(state.shippingChoices.values()).map((choice) => ({
                brandId: choice.brandId,
                shippingMethodId: choice.methodId,
            }));

            const order = await createOrder({
                shippingAddressId: state.selectedAddressId,
                deliveryChoices,
            });

            if (order) {
                dispatch({ type: "CREATE_ORDER_SUCCESS", payload: order.id });
                return order.id;
            }

            dispatch({ type: "CREATE_ORDER_FAILURE" });
            return null;
        } catch (error: unknown) {
            console.error("[useCheckout] handleCreateOrder error:", error);
            dispatch({ type: "CREATE_ORDER_FAILURE" });
            return null;
        }
    }, [canProceed, state.selectedAddressId, state.shippingChoices, createOrder]);

    // Finaliser le paiement
    const handlePaymentSuccess = useCallback(() => {
        if (!state.orderId) return;

        navigate(`/orders/${state.orderId}`);
    }, [state.orderId, navigate]);

    // Réinitialiser le checkout
    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    return {
        // États
        selectedAddressId: state.selectedAddressId,
        shippingChoices: state.shippingChoices,
        orderId: state.orderId,
        processing: state.processing,
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