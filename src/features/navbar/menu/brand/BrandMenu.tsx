import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dices } from "lucide-react";

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
        </>
    );
}