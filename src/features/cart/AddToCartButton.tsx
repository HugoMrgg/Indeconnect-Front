import { useTranslation } from "react-i18next";

interface AddToCartButtonProps {
    isAvailable: boolean;
    onClick: () => void;
}

export function AddToCartButton({ isAvailable, onClick }: AddToCartButtonProps) {
    const { t } = useTranslation();

    return (
        <button
            className="mt-6 bg-black text-white px-5 py-3 rounded-xl w-full text-lg"
            disabled={!isAvailable}
            onClick={onClick}
        >
            {isAvailable ? t('cart.add_to_cart') : t('cart.unavailable')}
        </button>
    );
}
