import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, Search } from "lucide-react";
import { useUI } from "@/context/UIContext";

type Props = {
    scope?: string;
    enabled?: boolean;
    onToggleFilters?: () => void;
    value?: string;
    onChange?: (value: string) => void;
};

export function SearchBar({
                              scope,
                              enabled = true,
                              onToggleFilters,
                              value = "",
                              onChange
                          }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { toggleFilters } = useUI();

    // Fonction pour gérer les placeholders selon le scope
    function getPlaceholder(scope?: string) {
        switch (scope) {
            case "brands":
                return t('search_bar.placeholder.brands');
            case "products":
                return t('search_bar.placeholder.products');
            case "wishlist":
                return t('search_bar.placeholder.wishlist');
            case "settings":
                return t('search_bar.placeholder.settings');
            case "accounts":
                return t('search_bar.placeholder.accounts');
            default:
                return t('search_bar.placeholder.default');
        }
    }

    const placeholder = getPlaceholder(scope);
    const disabledClasses = enabled ? "opacity-100" : "opacity-50 pointer-events-none select-none";

    return (
        <div className={"flex flex-grow items-center bg-black rounded-2xl h-12 shadow-inner pr-1 " + disabledClasses}
             aria-disabled={!enabled}
        >
            <button
                onClick={() => {
                    setOpen(!open);
                    (onToggleFilters ?? toggleFilters)();
                }}
                className="flex items-center space-x-1 p-1 mx-2 rounded-xl bg-gray-600 text-white"
            >
                <SlidersHorizontal size={20} />
                <p>{t('search_bar.filters')}</p>
            </button>

            {/**
             * Input contrôlé par le parent (Home.tsx)
             * value: vient de searchQuery
             * onChange: met à jour searchQuery
             */}
            <input
                type="text"
                placeholder={placeholder}
                className="w-full focus:ring-2 bg-black text-white outline-none"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <Search size={20} className="text-white mx-2" />
        </div>
    );
}