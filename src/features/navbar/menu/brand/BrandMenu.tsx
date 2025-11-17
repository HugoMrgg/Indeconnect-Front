import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dices, Shirt, Store } from "lucide-react";

export function BrandMenu() {
    const [ ,setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
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
        </>
    );
}