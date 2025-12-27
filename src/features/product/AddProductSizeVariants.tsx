import React from "react";

// Liste des tailles disponibles
const AVAILABLE_SIZES = [
    { id: 1, name: "XS" },
    { id: 2, name: "S" },
    { id: 3, name: "M" },
    { id: 4, name: "L" },
    { id: 5, name: "XL" },
    { id: 6, name: "XXL" },
];

interface SizeVariant {
    sizeId: number;
    sizeName: string;
    stockCount: number;
}

interface AddProductSizeVariantsProps {
    sizeVariants: SizeVariant[];
    onToggleSize: (sizeId: number, sizeName: string) => void;
    onUpdateStock: (sizeId: number, stockCount: number) => void;
}

export function AddProductSizeVariants({
    sizeVariants,
    onToggleSize,
    onUpdateStock,
}: AddProductSizeVariantsProps) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tailles et stocks</h3>
            <p className="text-sm text-gray-600">
                Sélectionnez les tailles disponibles et définissez leurs stocks
            </p>

            <div className="space-y-3">
                {AVAILABLE_SIZES.map((size) => {
                    const variant = sizeVariants.find((v) => v.sizeId === size.id);
                    const isSelected = !!variant;

                    return (
                        <div key={size.id} className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => onToggleSize(size.id, size.name)}
                                className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                                    isSelected
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {size.name}
                            </button>

                            {isSelected && (
                                <div className="flex-1 flex items-center gap-2">
                                    <label className="text-sm font-medium">Stock:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={variant.stockCount}
                                        onChange={(e) =>
                                            onUpdateStock(size.id, parseInt(e.target.value) || 0)
                                        }
                                        className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0"
                                    />
                                    <span className="text-sm text-gray-600">unités</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
