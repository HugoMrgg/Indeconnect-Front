import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Boxes, BarChart3 } from "lucide-react";

export function VendorMenu() {
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Package, label: "Mes produits", path: "/vendor/products" },
        { icon: Boxes, label: "Gestion du stock", path: "/vendor/inventory" },
        { icon: BarChart3, label: "Statistiques", path: "/vendor/stats" }
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
