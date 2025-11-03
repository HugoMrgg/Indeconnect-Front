import { useState } from "react";
import { User, Heart, ShoppingCart, Settings, List } from "lucide-react";

export function UserMenu() {
    const [open, setOpen] = useState(false);
    const isLoggedIn = true; // plus tard, ce sera un état global (auth context)

    return (
        <div className="relative h-12 w-12">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-2xl flex justify-center items-center bg-black text-white h-full w-full"
            >
                <User size={24} />
            </button>

            <div
                className={`absolute bottom-16 right-0 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-40
                transform transition-all duration-300 ease-out
                ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
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
        </div>
    );
}
