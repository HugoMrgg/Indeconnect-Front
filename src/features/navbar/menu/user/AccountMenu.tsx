import { Heart, List, Settings, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartUI } from "@/hooks/User/useCartUI";

export function AccountMenu() {
    const { openCart } = useCartUI();
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={() => navigate(`/wishlist`)}
                className="flex items-center gap-2 hover:text-gray-300">
                <Heart size={18}/> Favoris
            </button>
            <button onClick={openCart} className="flex items-center gap-2 hover:text-gray-300">
                <ShoppingCart size={18}/> Panier
            </button>
            <button className="flex items-center gap-2 hover:text-gray-300">
                <List size={18}/>  Commandes
            </button>
            <button className="flex items-center gap-2 hover:text-gray-300">
                <Settings size={18}/> Paramètres
            </button>
        </>
    );
}