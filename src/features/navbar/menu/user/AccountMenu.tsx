// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

import { Heart, List, Settings, ShoppingCart, LogOut } from "lucide-react";

export function AccountMenu() {
    // const [ ,setOpen] = useState(false);
    // const navigate = useNavigate();

    return (
        <>
            <button className="flex items-center gap-2 hover:text-gray-300">
                <Heart size={18}/> Favoris
            </button>
            <button className="flex items-center gap-2 hover:text-gray-300">
                <ShoppingCart size={18}/> Panier
            </button>
            <button className="flex items-center gap-2 hover:text-gray-300">
                <List size={18}/>  Commandes
            </button>
            <button className="flex items-center gap-2 hover:text-gray-300">
                <Settings size={18}/> Paramètres
            </button>
            <button className="flex items-center gap-2 text-red-600 hover:text-gray-300">
                <LogOut size={18}/> Se déconnecter
            </button>
        </>
    );
}