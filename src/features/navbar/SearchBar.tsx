import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { useUI } from "@/context/UIContext";

type Props = {
    scope?: string;
    enabled?: boolean;
    onToggleFilters?: () => void;
    value?: string;
    onChange?: (value: string) => void;
};

// create a method to handle all scenarios of scope
function handleScopes(scope?: string) {
    switch (scope) {
        case "brands":
            return "Rechercher parmi les marques...";
        case "products":
            return "Rechercher parmi les produits...";
        case "wishlist":
            return "Rechercher dans votre liste de souhaits...";
        case "settings":
            return "Rechercher dans les paramètres...";
        case "accounts":
            return "Rechercher parmi les comptes...";
        default:
            return "Rechercher sur cet page...";
    }
}
export function SearchBar({
                              scope,
                              enabled = true,
                              onToggleFilters,
                              value = "",
                              onChange
                          }: Props) {
    const [open, setOpen] = useState(false);
    const { toggleFilters } = useUI();

    const placeholder = handleScopes(scope);
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
                <p>Filtres</p>
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
