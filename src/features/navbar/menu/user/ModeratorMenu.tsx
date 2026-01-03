// @/features/navbar/menu/user/ModeratorMenu.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Package } from "lucide-react";

export function ModeratorMenu() {
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Users, label: "Gestion des Comptes", path: "/admin/accounts" },
        { icon: Package, label: "Modérer les produits", path: "/moderator/products" },
        { icon: MessageSquare, label: "Modérer les commentaires", path: "/moderator/reviews" }
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
