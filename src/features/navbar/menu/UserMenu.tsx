import { useState, useCallback } from "react";
import { GuestMenu } from "@/features/navbar/menu/user/GuestMenu";
import { AccountMenu } from "@/features/navbar/menu/user/AccountMenu";
import { AdminMenu } from "@/features/navbar/menu/user/AdminMenu";
import { ModeratorMenu } from "@/features/navbar/menu/user/ModeratorMenu";
import { SuperVendorMenu } from "@/features/navbar/menu/brand/superVendorMenu";
import { VendorMenu } from "@/features/navbar/menu/brand/VendorMenu";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
    const [open, setOpen] = useState(false);
    const { userRole, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const closeMenu = useCallback(() => setOpen(false), []);

    const handleLogout = useCallback(() => {
        logout();
        closeMenu();
        navigate("/");
    }, [logout, closeMenu, navigate]);

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

                {isAuthenticated && (
                    <>
                        <div className="border-t border-gray-700 my-2" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={18} />
                            Se déconnecter
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
