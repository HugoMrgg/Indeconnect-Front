import { Heart, List, Settings, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartUI } from "@/hooks/User/useCartUI";

export function AccountMenu() {
    const { openCart } = useCartUI();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <button
                onClick={() => navigate(`/wishlist`)}
                className="flex items-center gap-2 hover:text-gray-300">
                <Heart size={18}/> {t('navigation.menu.user.wishlist')}
            </button>
            <button onClick={openCart} className="flex items-center gap-2 hover:text-gray-300">
                <ShoppingCart size={18}/> {t('navigation.menu.user.cart')}
            </button>
            <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-2 hover:text-gray-300"
            >
                <List size={18} /> {t('navigation.menu.user.orders')}
            </button>
            <button
                onClick={() => navigate(`/settings`)}
                className="flex items-center gap-2 hover:text-gray-300">
                <Settings size={18}/> {t('navigation.menu.user.settings')}
            </button>
        </>
    );
}