import React from "react";
import { Heart, ShoppingCart, Settings, List } from "lucide-react";

export const UserMenu: React.FC = () => {
    return (
        <div className="fixed bottom-28 right-6 bg-black text-white rounded-2xl p-3 flex flex-col gap-3 shadow-lg">
            <button className="flex items-center gap-2 hover:text-yellow-400"><Heart size={18}/> Favoris</button>
            <button className="flex items-center gap-2 hover:text-yellow-400"><ShoppingCart size={18}/> Panier</button>
            <button className="flex items-center gap-2 hover:text-yellow-400"><List size={18}/> Commandes</button>
            <button className="flex items-center gap-2 hover:text-yellow-400"><Settings size={18}/> Paramètres</button>
        </div>
    );
};
