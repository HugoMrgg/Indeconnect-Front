import { useState } from "react";
import { Menu, Store, Shirt } from "lucide-react";

export function NavMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full bg-black text-white"
            >
                <Menu size={24} />
            </button>

            {open && (
                <div className="absolute bottom-12 left-0 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-40">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                        <Store size={18}/> IndeConnect
                    </button>
                    <button className="flex items-center gap-2 text-left hover:text-gray-300">
                        <Shirt size={18}/> Marques
                    </button>
                    <button className="flex items-center gap-2 text-left hover:text-gray-300">
                        <Shirt size={18}/> Vêtements
                    </button>
                </div>
            )}
        </div>
    );
}
