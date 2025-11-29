import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Users, Package, BarChart3, Palette, Settings } from "lucide-react";

export function SuperVendorMenu() {
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Store, label: "Ma marque", path: "/supervendor/brand" },
        { icon: Users, label: "Gestion vendeurs", path: "/supervendor/vendors" },
        { icon: Package, label: "Gérer les produits", path: "/supervendor/products" },
        { icon: BarChart3, label: "Statistiques", path: "/supervendor/stats" },
        { icon: Palette, label: "Personnaliser", path: "/supervendor/customize" },
        { icon: Settings, label: "Politiques", path: "/supervendor/policies" }
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
