import React from "react";
import { X, RotateCcw } from "lucide-react";
import SidebarFilters from "./SidebarFilters";

interface FiltersPanelProps {
    open: boolean;
    onClose: () => void;
    onReset: () => void;
    resetKey: number;

    onChangePrice: (min: string, max: string) => void;
    onChangeCategories: (cat: string, checked: boolean) => void;
    onChangeSizes: (size: string) => void;
    selectedCategories: string[];
    selectedSizes: string[];
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
                                                              open,
                                                              onClose,
                                                              onReset,
                                                              resetKey,
                                                              onChangePrice,
                                                              onChangeCategories,
                                                              onChangeSizes,
                                                              selectedCategories,
                                                              selectedSizes,
                                                          }) => {
    return (
        <>
            <div
                className={`
                    fixed inset-0 z-40 transition-opacity duration-300
                    bg-black/20 backdrop-blur-[1px]
                    ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                onClick={onClose}
            />

            <div
                className={`
                    fixed left-0 top-1/2 -translate-y-1/2
                    w-72 max-h-[90%] bg-white 
                    rounded-r-3xl shadow-2xl p-6 z-50 overflow-y-auto
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Filtres</h2>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <button
                    onClick={onReset}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black transition"
                >
                    <RotateCcw className="w-4 h-4" />
                    Réinitialiser les filtres
                </button>

                <SidebarFilters
                    resetKey={resetKey}
                    onChangePrice={onChangePrice}
                    onChangeCategories={onChangeCategories}
                    onChangeSizes={onChangeSizes}
                    selectedCategories={selectedCategories}
                    selectedSizes={selectedSizes}
                />
            </div>
        </>
    );
};
