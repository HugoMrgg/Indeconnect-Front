import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dice2  } from "lucide-react";

export function VendorMenu() {
    const [ ,setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="flex items-center gap-2 hover:text-gray-300">
                <Dice2  size={18}/> Ta marque
            </button>
        </>
    );
}