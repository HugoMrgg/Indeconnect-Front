import React from "react";
import { SidebarFilters } from "@/features/filters/SidebarFilters";
import { X } from "lucide-react";

interface FiltersPanelProps {
    open: boolean;
    onClose: () => void;

    onReset: () => void;
    resetKey: number;

    onChangePrice: (min: string, max: string) => void;
    onChangeCategories: (category: string, checked: boolean) => void;
    selectedCategories: string[];

    onChangeSizes: (size: string) => void;
    selectedSizes: string[];

    onChangeColors: (color: string) => void;
    selectedColors: string[];
    colorsAvailable: string[];

    onChangeEthics: (label: string, checked: boolean) => void;
    selectedEthics: string[];
    ethicsAvailable: string[];
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
                                                              open,
                                                              onClose,
                                                              onReset,
                                                              resetKey,

                                                              onChangePrice,
                                                              onChangeCategories,
                                                              onChangeSizes,
                                                              onChangeColors,
                                                              onChangeEthics,

                                                              selectedCategories,
                                                              selectedSizes,
                                                              selectedColors,
                                                              selectedEthics,

                                                              colorsAvailable,
                                                              ethicsAvailable,
                                                          }) => {
    return (
        <>
            {/* Overlay flouté */}
            {open && (
                <div
                    className="fixed inset-0 backdrop-blur-[1px] z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Panneau flottant centré verticalement */}
            <div
                className={`
                    fixed z-50 bg-white shadow-2xl rounded-3xl
                    w-[360px] max-w-[90vw]
                    max-h-[90vh] overflow-y-auto
                    left-[20px] top-1/2 -translate-y-1/2
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-[120%]"}
                `}
            >
                {/* Header compact */}
                <div className="flex items-center justify-between p-3 border-b">
                    <h2 className="font-semibold text-lg">Filtres</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* contenu */}
                <div className="p-5 space-y-6">
                    <SidebarFilters
                        key={resetKey}
                        resetKey={resetKey}
                        onChangePrice={onChangePrice}
                        onChangeCategories={onChangeCategories}
                        onChangeSizes={onChangeSizes}
                        onChangeColors={onChangeColors}
                        onChangeEthics={onChangeEthics}
                        selectedCategories={selectedCategories}
                        selectedSizes={selectedSizes}
                        selectedColors={selectedColors}
                        selectedEthics={selectedEthics}
                        availableColors={colorsAvailable}
                        availableEthics={ethicsAvailable}
                    />
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-white rounded-b-3xl">
                    <button
                        onClick={onReset}
                        className="w-full py-2.5 rounded-xl border text-sm hover:bg-gray-50 transition"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>
        </>
    );
};
