import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartUI } from "@/hooks/useCartUI";

export function CartContent() {
    const { user } = useAuth();
    const { cartOpen } = useCartUI();
    const { cart, loading, error, refetch } = useCart();

    useEffect(() => {
        if (cartOpen && user?.id) {
            refetch();
        }
    }, [cartOpen, user?.id, refetch]);

    if (!user?.id) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Veuillez vous connecter pour accéder à votre panier.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 animate-pulse">Chargement du panier...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Votre panier est vide.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col gap-4">
                {cart.items.map(item => (
                    <div key={item.productVariantId} className="flex gap-4 border-b pb-4">
                        {/* image de l'item */}
                        <img
                            src={"../../../images/" + item.primaryImageUrl || "/placeholder.png"}
                            alt={item.productName}
                            className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                        />

                        <div className="flex-1">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-xs text-gray-600 mb-1">{item.brandName}</div>

                            {item.size && (
                                <div className="text-xs text-gray-500">
                                    Taille : {item.size.name}
                                </div>
                            )}

                            {item.color && (
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    Couleur :
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 14,
                                            height: 14,
                                            background: item.color.hexa,
                                            borderRadius: "50%",
                                            border: "1px solid #ddd",
                                        }}
                                    ></span>
                                    {item.color.name}
                                </div>
                            )}

                            <div className="text-sm mt-2 flex items-center gap-2">
                                <span className="font-semibold">x{item.quantity}</span>
                                <span className="text-gray-600">· {item.unitPrice.toFixed(2)}€</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                            <span className="text-base font-bold">{item.lineTotal.toFixed(2)} €</span>
                            <span className="text-xs text-gray-500">
                                Stock : {item.availableStock}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 mt-4 bg-white">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Nombre d'articles</span>
                    <span className="font-medium">{cart.totalItems}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Sous-total</span>
                    <span className="font-bold text-xl">{cart.totalAmount.toFixed(2)} €</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-black text-white text-lg font-semibold hover:bg-gray-900 transition">
                    Passer commande
                </button>
            </div>
        </div>
    );
}
