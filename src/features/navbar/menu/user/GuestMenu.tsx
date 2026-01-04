import { useUI } from "@/context/UIContext";
import { useTranslation } from "react-i18next";
import { UserRoundCheck, UserRoundPlus } from "lucide-react";

export function GuestMenu() {
    const { openAuth } = useUI();
    const { t } = useTranslation();

    return (
        <>
            <button
                onClick={() => openAuth("login")}
                className="flex items-center gap-2 hover:text-gray-300">
                <UserRoundCheck size={18}/> {t('navigation.menu.guest.login')}
            </button>
            <button
                onClick={() => openAuth("register")}
                className="flex items-center gap-2 hover:text-gray-300">
                <UserRoundPlus size={18}/> {t('navigation.menu.guest.register')}
            </button>
        </>
    );
}