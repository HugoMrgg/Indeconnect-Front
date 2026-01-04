import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logs, Users, CreditCard, Truck, ListChecks } from "lucide-react";

export function AdminMenu() {
    const { t } = useTranslation();
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Logs, label: t('admin_menu.logs'), path: "/admin/logs" },
        { icon: Users, label: t('admin_menu.accounts'), path: "/admin/accounts" },
        { icon: CreditCard, label: t('admin_menu.payments'), path: "/admin/payments" },
        { icon: Truck, label: t('admin_menu.delivery'), path: "/admin/delivery" },
        { icon: ListChecks, label: t('admin_menu.ethics'), path: "/admin/ethics" },
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