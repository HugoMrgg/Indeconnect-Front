import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CreditCard, ListChecks } from "lucide-react";

export function AdminMenu() {
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Users, label: "Gérer les comptes", path: "/admin/accounts" },
        { icon: CreditCard, label: "Moyens de paiement", path: "/admin/payments" },
        { icon: ListChecks, label: "Gérer questionnaire éthique", path: "/admin/ethics" },
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
