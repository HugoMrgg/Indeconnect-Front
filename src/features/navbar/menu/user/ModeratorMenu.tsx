// @/features/navbar/menu/user/ModeratorMenu.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, MessageSquare, Users, Logs, Package, Store } from "lucide-react";
export function ModeratorMenu() {
    const { t } = useTranslation();
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Users, label: t('moderator_menu.accounts'), path: "/admin/accounts" },
        { icon: Store, label: t('moderator_menu.brands'), path: "/moderator/brands" },
        { icon: Package, label: t('moderator_menu.products'), path: "/moderator/products" },
        { icon: MessageSquare, label: t('moderator_menu.reviews'), path: "/moderator/reviews" }
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