/*
import React, { useState, useEffect } from "react";
import { COLOR_MAP } from "@/constants/colors";

interface SidebarFiltersProps {
    onChangePrice?: (min: string, max: string) => void;
    onChangeCategories?: (category: string, checked: boolean) => void;
    onChangeSizes?: (size: string) => void;
    onChangeColors?: (color: string) => void;
    onChangeEthics?: (ethic: string, checked: boolean) => void;

    selectedCategories?: string[];
    selectedSizes?: string[];
    selectedColors?: string[];
    selectedEthics?: string[];

    availableColors?: string[];
    availableEthics?: string[];

    resetKey?: number;
}

const CATEGORIES = ["t-shirt", "pull", "sweat", "jeans"] as const;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
                                                                  onChangePrice,
                                                                  onChangeCategories,
                                                                  onChangeSizes,
                                                                  onChangeColors,
                                                                  onChangeEthics,

                                                                  selectedCategories = [],
                                                                  selectedSizes = [],
                                                                  selectedColors = [],
                                                                  selectedEthics = [],

                                                                  availableColors = [],
                                                                  availableEthics = [],

                                                                  resetKey = 0,
                                                              }) => {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    // Réinitialise les champs internes au changement de resetKey
    useEffect(() => {
        setMin("");
        setMax("");
        onChangePrice?.("", "");
    }, [onChangePrice, resetKey]);

    return (
        <aside className="space-y-7">
            {/!* Prix *!/}
            <div>
                <div className="font-medium mb-2">Prix :</div>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        value={min}
                        onChange={(e) => {
                            setMin(e.target.value);
                            onChangePrice?.(e.target.value, max);
                        }}
                        placeholder="Min"
                        className="rounded-lg border px-3 py-2"
                        inputMode="numeric"
                    />
                    <input
                        value={max}
                        onChange={(e) => {
                            setMax(e.target.value);
                            onChangePrice?.(min, e.target.value);
                        }}
                        placeholder="Max"
                        className="rounded-lg border px-3 py-2"
                        inputMode="numeric"
                    />
                </div>
            </div>

            {/!* Catégories *!/}
            <div>
                <div className="font-medium mb-2">Catégories</div>
                <div className="space-y-2">
                    {CATEGORIES.map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(c)}
                                onChange={(e) =>
                                    onChangeCategories?.(c, e.target.checked)
                                }
                            />
                            <span className="capitalize">{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/!* Tailles *!/}
            <div>
                <div className="font-medium mb-2">Taille</div>
                <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((s) => {
                        const active = selectedSizes.includes(s);
                        return (
                            <button
                                key={s}
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

            {/!* ✅ Couleurs *!/}
            {availableColors.length > 0 && (
                <div>
                    <div className="font-medium">Couleurs</div>

                    <div className="mt-3 grid grid-cols-6 gap-2">
                    {availableColors.map((c) => {
                        const selected = selectedColors.includes(c);
                        const hex = COLOR_MAP[c] ?? "#ccc";
                        return (
                            <button
                                key={c}
                                onClick={() => onChangeColors?.(c)}
                                className={`
                                    flex flex-col items-center gap-1
                                    transition-all
                                `}
                            >
                                {/!* Cercle couleur *!/}
                                <div
                                    className={`
                                        flex items-center justify-center
                                        rounded-full transition-all
                                        ${selected ? "ring-2 ring-blue-500" : "ring-0"}
                                    `}
                                    style={{
                                        padding: "3px", // ✅ distance entre couleur et ring (2–3px)
                                    }}
                                    >
                                    <div
                                        className={`
                                            w-8 h-8
                                            rounded-full
                                            border border-black
                                        `}
                                        style={{
                                            backgroundColor: hex,
                                            padding: "3px",
                                        }}
                                        title={c}
                                    />
                                </div>
                                {/!* Nom de la couleur *!/}
                                <span className={`text-[11px] leading-none text-center w-14 ${selected ? "font-semibold" : ""}`}> {/!*className="text-[11px] leading-none text-center w-14"*!/}
                                    {c}
                                </span>
                            </button>

                        );
                    })}
                </div>
            </div>
            )}

            {/!* ✅ Éthique *!/}
            {availableEthics.length > 0 && (
                <div>
                    <div className="font-medium mb-2">Éthique</div>
                    <div className="space-y-2">
                        {availableEthics.map((label) => (
                            <label key={label} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedEthics.includes(label)}
                                    onChange={(e) =>
                                        onChangeEthics?.(label, e.target.checked)
                                    }
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};


*/
import React, { useState, useEffect } from "react";
import { COLOR_MAP } from "@/constants/colors";

interface SidebarFiltersProps {
    onChangePrice?: (min: string, max: string) => void;
    onChangeCategories?: (category: string, checked: boolean) => void;
    onChangeSizes?: (size: string) => void;
    onChangeColors?: (color: string) => void;
    onChangeEthics?: (ethic: string, checked: boolean) => void;

    selectedCategories?: string[];
    selectedSizes?: string[];
    selectedColors?: string[];
    selectedEthics?: string[];

    availableColors?: string[];
    availableEthics?: string[];

    resetKey?: number;
}

const CATEGORIES = ["t-shirt", "pull", "sweat", "jeans"] as const;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
                                                                  onChangePrice,
                                                                  onChangeCategories,
                                                                  onChangeSizes,
                                                                  onChangeColors,
                                                                  onChangeEthics,

                                                                  selectedCategories = [],
                                                                  selectedSizes = [],
                                                                  selectedColors = [],
                                                                  selectedEthics = [],

                                                                  availableColors = [],
                                                                  availableEthics = [],

                                                                  resetKey = 0,
                                                              }) => {

    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    /** ✅ Reset automatique des champs prix */
    useEffect(() => {
        setMin("");
        setMax("");
        onChangePrice?.("", "");
    }, [onChangePrice, resetKey]);

    return (
        <aside className="space-y-7">

            {/* ✅ PRIX */}
            <div>
                <div className="font-medium mb-2">Prix :</div>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        value={min}
                        onChange={(e) => {
                            setMin(e.target.value);
                            onChangePrice?.(e.target.value, max);
                        }}
                        placeholder="Min"
                        className="rounded-lg border px-3 py-2"
                        inputMode="numeric"
                    />

                    <input
                        value={max}
                        onChange={(e) => {
                            setMax(e.target.value);
                            onChangePrice?.(min, e.target.value);
                        }}
                        placeholder="Max"
                        className="rounded-lg border px-3 py-2"
                        inputMode="numeric"
                    />
                </div>
            </div>

            {/* ✅ 2 COLONNES : Catégories + Éthique */}
            <div className="grid grid-cols-2 gap-6">

                {/* CATEGORIES */}
                <div>
                    <div className="font-medium mb-2">Catégories</div>
                    <div className="space-y-2">
                        {CATEGORIES.map((c) => (
                            <label key={c} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(c)}
                                    onChange={(e) =>
                                        onChangeCategories?.(c, e.target.checked)
                                    }
                                />
                                <span className="capitalize">{c}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* ETHIQUE */}
                <div>
                    <div className="font-medium mb-2">Éthique</div>
                    <div className="space-y-2">
                        {availableEthics.map((label) => (
                            <label key={label} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedEthics.includes(label)}
                                    onChange={(e) =>
                                        onChangeEthics?.(label, e.target.checked)
                                    }
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ COULEURS */}
            {availableColors.length > 0 && (
                <div>
                    <div className="font-medium mb-2">Couleurs</div>

                    <div className="grid grid-cols-6 gap-3">
                        {availableColors.map((c) => {
                            const selected = selectedColors.includes(c);
                            const hex = COLOR_MAP[c] ?? "#ccc";

                            return (
                                <button
                                    key={c}
                                    onClick={() => onChangeColors?.(c)}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div
                                        className={`
                                            rounded-full transition-all
                                            ${selected ? "ring-2 ring-blue-500 scale-110" : ""}
                                        `}
                                        style={{
                                            padding: "3px",
                                        }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-400"
                                            style={{ backgroundColor: hex }}
                                        />
                                    </div>

                                    <span
                                        className={`text-[11px] w-12 text-center ${
                                            selected ? "font-semibold" : ""
                                        }`}
                                    >
                                        {c}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ✅ TAILLES */}
            <div>
                <div className="font-medium mb-2">Taille</div>

                <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((s) => {
                        const active = selectedSizes.includes(s);

                        return (
                            <button
                                key={s}
                                onClick={() => onChangeSizes?.(s)}
                                className={`
                                    rounded-lg border px-3 py-1 text-sm transition
                                    ${
                                    active
                                        ? "bg-black text-white border-black"
                                        : "hover:bg-gray-100"
                                }
                                `}
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
