import React, { useEffect } from "react";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useCart } from "@/hooks/User/useCart";
import { useCartUI } from "@/hooks/User/useCartUI";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CartContent() {
    const { user } = useAuth();
    const { cartOpen, closeCart } = useCartUI();
    const { cart, loading, error, refetch, removeFromCart, removingFromCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (cartOpen && user?.id) {
            refetch();
        }
    }, [cartOpen, user?.id, refetch]);

    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };

    if (!user?.id) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                    Veuillez vous connecter pour accéder à votre panier.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 animate-pulse">
                    Chargement du panier...
                </p>
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
            <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="flex flex-col gap-4">
                    {cart.items.map((item) => {
                        const imageUrl = item.primaryImageUrl
                            ? `${item.primaryImageUrl}`
                            : "/placeholder.png";

                        return (
                            <div
                                key={item.productVariantId}
                                className="flex gap-4 border-b pb-4 last:border-b-0"
                            >
                                {/* Image du produit */}
                                <img
                                    src={imageUrl}
                                    alt={item.productName}
                                    className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                                />

                                {/* Infos produit */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {item.productName}
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">
                                        {item.brandName}
                                    </div>

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
                                        <span className="font-semibold">
                                            x{item.quantity}
                                        </span>
                                        <span className="text-gray-600">
                                            · {item.unitPrice.toFixed(2)}€
                                        </span>
                                    </div>
                                </div>

                                {/* Prix + Bouton supprimer */}
                                <div className="flex flex-col items-end justify-between flex-shrink-0">
                                    <span className="text-base font-bold">
                                        {item.lineTotal.toFixed(2)} €
                                    </span>
                                    <span className="text-xs text-gray-500 mb-2">
                                        Stock : {item.availableStock}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.productVariantId)}
                                        disabled={removingFromCart}
                                        className="text-red-500 hover:text-red-700 transition p-1 disabled:opacity-50"
                                        title="Retirer du panier"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="border-t bg-white px-5 py-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Nombre d&apos;articles</span>
                    <span className="font-medium">{cart.totalItems}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Sous-total</span>
                    <span className="font-bold text-xl">
                        {cart.totalAmount.toFixed(2)} €
                    </span>
                </div>
                <button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-xl bg-black text-white text-lg font-semibold hover:bg-gray-900 transition"
                >
                    Passer commande
                </button>
            </div>
        </div>
    );
}