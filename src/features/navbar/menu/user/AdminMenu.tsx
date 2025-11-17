import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Logs, UserCog } from "lucide-react";

export function AdminMenu() {
    const [ ,setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="flex items-center gap-2 hover:text-gray-300">
                <Logs  size={18}/> Consulter les logs
            </button>
            <button
                onClick={() => { setOpen(false); navigate("/register"); }}
                className="flex items-center gap-2 hover:text-gray-300">
                <UserCog size={18}/> Gérer les comptes
            </button>
        </>
    );
}