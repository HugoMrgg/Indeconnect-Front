import { useState } from "react";
import { GuestMenu } from "@/features/navbar/menu/user/GuestMenu";
import { AccountMenu } from "@/features/navbar/menu/user/AccountMenu";
import { AdminMenu } from "@/features/navbar/menu/user/AdminMenu";
import { ModeratorMenu } from "@/features/navbar/menu/user/ModeratorMenu";
import { SuperVendorMenu } from "@/features/navbar/menu/brand/superVendorMenu";
import { VendorMenu } from "@/features/navbar/menu/brand/VendorMenu";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
    const [open, setOpen] = useState(false);
    const { userRole } = useAuth();

    const closeMenu = () => setOpen(false);

    const renderMenu = () => {
        switch (userRole) {
            case "Guest":
                return <GuestMenu />;
            case "Client":
                return <AccountMenu onLogout={closeMenu} />;
            case "Administrator":
                return <AdminMenu />;
            case "Moderator":
                return <ModeratorMenu />;
            case "SuperVendor":
                return <SuperVendorMenu />;
            case "Vendor":
                return <VendorMenu />;
            default:
                return <GuestMenu />;
        }
    };

    return (
        <div className="relative h-12 w-12">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-2xl flex justify-center items-center bg-black text-white h-full w-full hover:bg-gray-800 transition-colors"
            >
                <User size={24} />
            </button>

            <div
                className={`absolute bottom-16 right-0 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-48 transition-all duration-300 ease-out ${
                    open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
                {renderMenu()}
            </div>
        </div>
    );
}
