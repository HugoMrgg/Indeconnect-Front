import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

export function VendorMenu() {
    const [, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: Package, label: "Mes produits", path: "/my-brand" } // Vendor voit uniquement les produits
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