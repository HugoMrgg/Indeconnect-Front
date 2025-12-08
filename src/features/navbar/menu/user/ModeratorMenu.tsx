// @/features/navbar/menu/user/ModeratorMenu.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, MessageSquare, Users, Logs, Package } from "lucide-react";

export function ModeratorMenu() {
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Users, label: "Gestion des Comptes", path: "/admin/accounts" },
        { icon: CheckCircle, label: "Valider les marques", path: "/moderator/brands" },
        { icon: Package, label: "Modérer les produits", path: "/moderator/products" },
        { icon: MessageSquare, label: "Modérer les commentaires", path: "/moderator/reviews" },
        { icon: Logs, label: "Consulter les logs", path: "/moderator/logs" }
    ];

    return (
        <>
            {menuItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => {
                        setOpen(false);
                        navigate(item.path);
                    }}
                    className="flex items-center gap-2 hover:text-gray-300"
                >
                    <item.icon size={18} />
                    {item.label}
                </button>
            ))}
        </>
    );
}
