import { useState } from "react";
import { User, Heart, ShoppingCart, Settings, List } from "lucide-react";

export function UserMenu() {
    const [open, setOpen] = useState(false);
    const isLoggedIn = true; // plus tard, ce sera un état global (auth context)

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full bg-black text-white"
            >
                <User size={24} />
            </button>

            {open && (
                <div className="absolute bottom-12 right-0 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-40">
                    {isLoggedIn ? (
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
                        </>
                    ) : (
                        <>
                            <button className="flex items-center gap-2 hover:text-gray-300">
                                Se connecter
                            </button>
                            <button className="flex items-center gap-2 hover:text-gray-300">
                                S’inscrire
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
