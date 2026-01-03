import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useCart } from "@/hooks/User/useCart";
import { useCheckout } from "@/hooks/Order/useCheckout";
import { ShippingAddressSelector } from "@/features/checkout/ShippingAddressSelector";
import { ShippingMethodSelector } from "@/features/checkout/ShippingMethodSelector";
import { CheckoutSummary } from "@/features/checkout/CheckoutSummary";
import { CheckoutFooter } from "@/features/checkout/CheckoutFooter";
import { CartItemDto } from "@/api/services/cart/types";
import { Loader2 } from "lucide-react";
import { CheckoutSkeleton } from "@/components/skeletons";

export function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, loading: cartLoading } = useCart();
    const {
        selectedAddressId,
        shippingChoices,
        orderId,
        processing,
        selectAddress,
        selectShippingMethod,
        handleCreateOrder,
        handlePaymentSuccess,
    } = useCheckout();

    // Redirection si non authentifié ou panier vide
    // MAIS on ne redirige pas si une commande a été créée (orderId existe)
    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        // Ne pas rediriger si une commande est en cours ou créée
        if (orderId) {
            return;
        }

        if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
            navigate("/cart");
        }
    }, [user, cart, cartLoading, navigate, orderId]);

    const itemsByBrand = useMemo(() => {
        if (!cart || !cart.items || !Array.isArray(cart.items)) {
            return new Map<number, CartItemDto[]>();
        }

        const grouped = new Map<number, CartItemDto[]>();
        cart.items.forEach((item) => {
            if (!grouped.has(item.brandId)) {
                grouped.set(item.brandId, []);
            }
            grouped.get(item.brandId)!.push(item);
        });
        return grouped;
    }, [cart]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Vous devez être connecté pour accéder au checkout</p>
            </div>
        );
    }

    if (cartLoading || !cart) {
        return <CheckoutSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Sélection de l'adresse */}
                        <ShippingAddressSelector
                            userId={user.id}
                            selectedAddressId={selectedAddressId}
                            onSelectAddress={selectAddress}
                        />

                        {/* 2. Méthodes de livraison par marque (affichées seulement si adresse sélectionnée) */}
                        {selectedAddressId && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Modes de livraison</h2>
                                {Array.from(itemsByBrand.entries()).map(([brandId, items]) => (
                                    <ShippingMethodSelector
                                        key={`${brandId}-${selectedAddressId}`}
                                        brandId={brandId}
                                        brandName={items[0].brandName}
                                        items={items}
                                        selectedMethodId={shippingChoices.get(brandId)?.methodId}
                                        addressId={selectedAddressId}
                                        onSelectMethod={(methodId, price, displayName) => {
                                            selectShippingMethod(brandId, methodId, price, displayName);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne récapitulatif */}
                    <div className="lg:col-span-1">
                        <CheckoutSummary
                            cart={cart}
                            itemsByBrand={itemsByBrand}
                            shippingChoices={shippingChoices}
                        />

                        {/* Footer avec bouton créer commande + paiement */}
                        <CheckoutFooter
                            cart={cart}
                            selectedAddressId={selectedAddressId}
                            shippingChoices={shippingChoices}
                            orderId={orderId}
                            processing={processing}
                            onCreateOrder={handleCreateOrder}
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}