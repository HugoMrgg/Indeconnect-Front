// src/features/cart/CartContent.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCart } from "@/api/services/cart";
import { CartDto } from "@/api/services/cart/types";

export function CartContent() {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) {
            setCart(null);
            return;
        }
        setLoading(true);
        setError(null);
        getCart(user.id)
            .then((data) => setCart(data))
            .catch((e) => {
                setError("Erreur lors du chargement du panier.");
                console.error("[PANIER] Erreur getCart:", e);
            })
            .finally(() => setLoading(false));
    }, [user?.id]);

    if (!user?.id) return <p>Veuillez vous connecter pour accéder à votre panier.</p>;
    if (loading) return <p>Chargement du panier...</p>;
    if (error) return <p>{error}</p>;
    if (!cart || cart.items.length === 0) return <p>Votre panier est vide.</p>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col gap-4">
                {cart.items.map(item => (
                    <div key={item.productVariantId} className="flex gap-4 border-b pb-4">
                        <div className="flex-1">
                            <div className="font-medium">{item.productName}</div>
                            {item.size && (
                                <div className="text-xs text-gray-500">Taille : {item.size.name}</div>
                            )}
                            {item.color && (
                                <div className="text-xs text-gray-500">
                                    Couleur : <span style={{
                                    display: "inline-block",
                                    width: 16,
                                    height: 16,
                                    background: item.color.hexa,
                                    borderRadius: "50%",
                                    marginLeft: 4,
                                    border: "1px solid #ddd"
                                }}></span>
                                </div>
                            )}
                            <div className="text-sm mt-1 flex items-center gap-2">
                                <span className="font-semibold">x{item.quantity}</span>
                                <span className="text-gray-600">· {item.unitPrice}€</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-base font-bold">{item.lineTotal} €</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t pt-4 mt-4 bg-white sticky bottom-0">
                <div className="flex items-center justify-between mb-2">
                    <span>Sous-total</span>
                    <span className="font-bold">{cart.totalAmount} €</span>
                </div>
                <button
                    className="w-full py-3 rounded-xl bg-black text-white text-lg font-semibold mt-3 hover:bg-gray-900 transition"
                >
                    Passer commande
                </button>
            </div>
        </div>
    );
}
