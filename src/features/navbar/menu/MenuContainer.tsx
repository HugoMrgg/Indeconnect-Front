import { useState } from "react";

import { BrandMenu } from "@/features/navbar/menu/brand/BrandMenu"
import { VendorMenu } from "@/features/navbar/menu/brand/VendorMenu";
import { SuperVendorMenu } from "@/features/navbar/menu/brand/superVendorMenu";

import { Menu } from "lucide-react";
    import {userStorage} from "@/storage/UserStorage";

export function MenuContainer() {
    const [open, setOpen] = useState(false);
    const user = userStorage.getUser();

    const roleLogged = user?.role ?? "Guest";

    return (
        <div className="relative h-12 w-12">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-2xl flex justify-center items-center bg-black text-white h-full w-full"
            >
                <Menu size={24} />
            </button>

            <div
                className={`absolute bottom-16 bg-black text-white rounded-2xl p-3 shadow-lg flex flex-col gap-2 w-40
                transform transition-all duration-300 ease-out
                ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
                <BrandMenu/>

                {(roleLogged === "Vendor" || roleLogged === "SuperVendor") && (
                    <>
                        <div className="border-t border-gray-700 my-1" />
                        <VendorMenu/>
                        {(roleLogged === "SuperVendor") && (
                            <SuperVendorMenu/>
                        )}

                    </>
                )}
            </div>
        </div>
    );
}
