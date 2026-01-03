import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addVariantToCart, removeVariantFromCart, clearCart } from "@/api/services/cart";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useCartUI } from "@/hooks/User/useCartUI";
import toast from "react-hot-toast";

export function useCart(shouldFetch: boolean = true) {
    const { user } = useAuth();
    const { openCart } = useCartUI();
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['cart', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            return await getCart(user.id);
        },
        enabled: shouldFetch && !!user?.id,
        staleTime: 1 * 60 * 1000, // 1 min (panier change souvent)
    });

    const addMutation = useMutation({
        mutationFn: async ({ variantId, quantity }: { variantId: number; quantity: number }) => {
            if (!user?.id) throw new Error("Non authentifié");
            await addVariantToCart(user.id, variantId, quantity);
        },
        onSuccess: () => {
            toast.success("Produit ajouté au panier !", {
                icon: "🛒",
                duration: 2000,
            });
            queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
            setTimeout(() => openCart(), 300);
        },
        onError: (e: unknown) => {
            const message = e instanceof Error ? e.message : "Erreur ajout panier";
            toast.error(message);
        },
    });

    const removeMutation = useMutation({
        mutationFn: async ({ variantId, quantity }: { variantId: number; quantity?: number }) => {
            if (!user?.id) throw new Error("Non authentifié");
            await removeVariantFromCart(user.id, variantId, quantity);
        },
        onSuccess: () => {
            toast.success("Produit retiré du panier", {
                icon: "🗑️",
                duration: 2000,
            });
            queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
        },
        onError: (e: unknown) => {
            const message = e instanceof Error ? e.message : "Erreur suppression";
            toast.error(message);
        },
    });

    const clearMutation = useMutation({
        mutationFn: async () => {
            if (!user?.id) throw new Error("Non authentifié");
            await clearCart(user.id);
        },
        onSuccess: () => {
            toast.success("Panier vidé", {
                icon: "🗑️",
                duration: 2000,
            });
            queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
        },
        onError: (e: unknown) => {
            const message = e instanceof Error ? e.message : "Erreur vidage panier";
            toast.error(message);
        },
    });

    const addToCart = async (variantId: number, quantity: number) => {
        if (!user?.id) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }
        await addMutation.mutateAsync({ variantId, quantity });
        return true;
    };

    const removeFromCart = async (variantId: number, quantity?: number) => {
        if (!user?.id) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }
        await removeMutation.mutateAsync({ variantId, quantity });
    };

    const clearUserCart = async () => {
        if (!user?.id) {
            toast.error("Veuillez vous connecter");
            throw new Error("Non authentifié");
        }
        await clearMutation.mutateAsync();
    };

    return {
        cart: data ?? null,
        loading: isLoading,
        addingToCart: addMutation.isPending,
        removingFromCart: removeMutation.isPending,
        error: error ? "Erreur lors du chargement du panier." : null,
        refetch,
        addToCart,
        removeFromCart,
        clearUserCart,
    };
}
