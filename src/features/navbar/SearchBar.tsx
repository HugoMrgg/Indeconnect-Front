import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { useUI } from "@/context/UIContext";

type Props = {
    scope?: "brands" | "products";
    enabled?: boolean;
    onToggleFilters?: () => void;
};

export function SearchBar({ scope: scopeProp, enabled = true, onToggleFilters }: Props) {
    const [open, setOpen] = useState(false);
    const { scope: scopeCtx, toggleFilters } = useUI();
    const scope = scopeProp ?? scopeCtx;

    const placeholder = scope === "brands" ? "Rechercher une marque…" : "Rechercher un vêtement…";
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

            <input type="text" placeholder={placeholder} className="w-full focus:ring-2 bg-black text-white" />
            <Search size={20} className="text-white mx-2" />
        </div>
    );
}
