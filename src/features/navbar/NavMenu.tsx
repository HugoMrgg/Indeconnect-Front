import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Dices, Store, Shirt } from "lucide-react";

export function NavMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative h-12 w-12">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-2xl flex justify-center items-center bg-black text-white h-full w-full"
            >
                <Menu size={24} />
            </button>

            <div
                className={`absolute bottom-16 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-40
                transform transition-all duration-300 ease-out
                ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
                <button
                    onClick={() => { setOpen(false); navigate("/"); }}
                    className="flex items-center gap-2 hover:text-gray-300"
                >
                    <Dices size={18}/> IndeConnect
                </button>
                <button className="flex items-center gap-2 text-left hover:text-gray-300">
                    <Store size={18}/> Marques
                </button>
                <button className="flex items-center gap-2 text-left hover:text-gray-300">
                    <Shirt size={18}/> Vêtements
                </button>
            </div>
        </div>
    );
}
