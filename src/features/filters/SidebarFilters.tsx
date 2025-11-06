import React, { useState, useEffect } from "react";

const CATEGORIES = ["t-shirt", "pull", "sweat", "jeans"] as const;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

interface SidebarFiltersProps {
    onChangePrice?: (min: string, max: string) => void;
    onChangeCategories?: (category: string, checked: boolean) => void;
    onChangeSizes?: (size: string) => void;
    selectedCategories?: string[];
    selectedSizes?: string[];
    resetKey?: number; // ✅ clé de réinitialisation
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
                                                                  onChangePrice,
                                                                  onChangeCategories,
                                                                  onChangeSizes,
                                                                  selectedCategories = [],
                                                                  selectedSizes = [],
                                                                  resetKey = 0, // ✅ valeur par défaut
                                                              }) => {

    const [min, setMin] = useState<string>("");
    const [max, setMax] = useState<string>("");

    // ✅ Réinitialisation automatique quand resetKey change
    useEffect(() => {
        setMin("");
        setMax("");
        onChangePrice?.("", "");
    }, [resetKey]);

    return (
        <aside className="space-y-6">
            {/* Prix */}
            <div>
                <div className="font-medium">Prix :</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                        value={min}
                        onChange={(e) => {
                            const v = e.target.value;
                            setMin(v);
                            onChangePrice?.(v, max);
                        }}
                        placeholder="Min"
                        className="rounded-lg border px-3 py-2"
                        inputMode="numeric"
                    />
                    <input
                        value={max}
                        onChange={(e) => {
                            const v = e.target.value;
                            setMax(v);
                            onChangePrice?.(min, v);
                        }}
                        placeholder="Max"
                        className="rounded-lg border px-3 py-2"
                        inputMode="numeric"
                    />
                </div>
            </div>

            {/* Catégories */}
            <div>
                <div className="font-medium">Catégories</div>
                <div className="mt-2 space-y-2">
                    {CATEGORIES.map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(c)}
                                onChange={(e) => onChangeCategories?.(c, e.target.checked)}
                            />
                            <span className="capitalize">{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Tailles */}
            <div>
                <div className="font-medium">Taille</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                    {SIZES.map((s) => {
                        const active = selectedSizes.includes(s);
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => onChangeSizes?.(s)}
                                className={`rounded-lg border px-3 py-1 text-sm transition ${
                                    active
                                        ? "bg-black text-white border-black"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default SidebarFilters;
