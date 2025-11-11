import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChartColumn } from "lucide-react";

export function SuperVendorMenu() {
    const [ ,setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={() => { setOpen(false); navigate("/register"); }}
                className="flex items-center gap-2 hover:text-gray-300">
                <ChartColumn size={18}/> Statistique
            </button>
        </>
    );
}