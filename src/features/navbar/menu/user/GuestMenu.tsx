import { useUI } from "@/context/UIContext";

import { UserRoundCheck, UserRoundPlus } from "lucide-react";

export function GuestMenu() {
    const { openAuth } = useUI();

    return (
        <>
            <button
                onClick={() => openAuth("login")}
                className="flex items-center gap-2 hover:text-gray-300">
                <UserRoundCheck size={18}/> Se connecter
            </button>
            <button
                onClick={() => openAuth("register")}
                className="flex items-center gap-2 hover:text-gray-300">
                <UserRoundPlus size={18}/> S’inscrire
            </button>
        </>
    );
}