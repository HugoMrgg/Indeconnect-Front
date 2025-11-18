import { useState } from "react";

import { GuestMenu } from "@/features/navbar/menu/user/GuestMenu";
import { AccountMenu } from "@/features/navbar/menu/user/AccountMenu";
import { AdminMenu } from "@/features/navbar/menu/user/AdminMenu";

import { User } from "lucide-react";

export function UserMenu() {
    const [open, setOpen] = useState(false);
    const roleLogged = "guest";

    return (
        <div className="relative h-12 w-12">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-2xl flex justify-center items-center bg-black text-white h-full w-full"
            >
                <User size={24} />
            </button>

            <div
                className={`absolute bottom-16 right-0 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-48
                transform transition-all duration-300 ease-out
                ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
                {roleLogged === "guest" ? (
                    <GuestMenu/>
                ) : (
                    <AccountMenu/>
                )}

                {roleLogged === "admin" && (
                    <>
                        <div className="border-t border-gray-700 my-1" />
                        <AdminMenu/>
                    </>
                )}
            </div>
        </div>
    );
}
