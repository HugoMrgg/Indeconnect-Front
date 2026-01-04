import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Store, Users, Package, BarChart3, Palette, Settings } from "lucide-react";

export function SuperVendorMenu() {
    const { t } = useTranslation();
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Store, label: t('supervendor_menu.my_brand'), path: "/my-brand" },
        { icon: Users, label: t('supervendor_menu.vendors'), path: "/supervendor/vendors" },
        { icon: Package, label: t('supervendor_menu.products'), path: "/supervendor/products" },
        { icon: BarChart3, label: t('supervendor_menu.stats'), path: "/supervendor/stats" },
        { icon: Palette, label: t('supervendor_menu.customize'), path: "/supervendor/customize" },
        { icon: Settings, label: t('supervendor_menu.policies'), path: "/supervendor/policies" }
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
