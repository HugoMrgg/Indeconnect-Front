import { useState, useEffect, useCallback } from "react";
import { getCart, addVariantToCart, removeVariantFromCart, clearCart } from "@/api/services/cart";
import { CartDto } from "@/api/services/cart/types";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useCartUI } from "@/hooks/User/useCartUI";
import toast from "react-hot-toast";

export function useCart(shouldFetch: boolean = true) {
    const { user } = useAuth();
    const { openCart } = useCartUI();
    const [cart, setCart] = useState<CartDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [removingFromCart, setRemovingFromCart] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch le panier depuis l'API
     */
    const fetchCart = useCallback(async () => {
        if (!user?.id) {
            setCart(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getCart(user.id);
            setCart(data);
        } catch (e) {
            setError("Erreur lors du chargement du panier.");
            console.error("[PANIER] Erreur getCart:", e);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    /**
     * Ajoute un produit au panier
     */
    const addToCart = useCallback(async (variantId: number, quantity: number) => {
        if (!user?.id) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }

        setAddingToCart(true);

        try {
            await addVariantToCart(user.id, variantId, quantity);

            toast.success("Produit ajouté au panier !", {
                icon: "🛒",
                duration: 2000,
            });

            await fetchCart();

            setTimeout(() => {
                openCart();
            }, 300);

            return true;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Erreur ajout panier";
            toast.error(message);
            throw e;
        } finally {
            setAddingToCart(false);
        }
    }, [user?.id, fetchCart, openCart]);

    /**
     * Retire un produit du panier
     */
    const removeFromCart = useCallback(async (variantId: number, quantity?: number) => {
        if (!user?.id) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }

        setRemovingFromCart(true);

        try {
            await removeVariantFromCart(user.id, variantId, quantity);

            toast.success("Produit retiré du panier", {
                icon: "🗑️",
                duration: 2000,
            });

            await fetchCart();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Erreur suppression";
            toast.error(message);
            throw e;
        } finally {
            setRemovingFromCart(false);
        }
    }, [user?.id, fetchCart]);

    /**
     * Vide le panier
     */
    const clearUserCart = useCallback(async () => {
        if (!user?.id) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }

        try {
            await clearCart(user.id);

            toast.success("Panier vidé", {
                icon: "🗑️",
                duration: 2000,
            });

            await fetchCart();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Erreur vidage panier";
            toast.error(message);
            throw e;
        }
    }, [user?.id, fetchCart]);

    // Auto-fetch au montage et quand user change
    useEffect(() => {
        if (shouldFetch) {
            fetchCart();
        }
    }, [fetchCart, shouldFetch]);

    return {
        cart,
        loading,
        addingToCart,
        removingFromCart,
        error,
        refetch: fetchCart,
        addToCart,
        removeFromCart,
        clearUserCart,
    };
}
