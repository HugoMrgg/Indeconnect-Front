import React from "react";
import { Loader2 } from "lucide-react";
import { SizeDto } from "@/api/services/sizes";

interface SizeVariant {
    sizeId: number;
    sizeName: string;
    stockCount: number;
}

interface AddProductSizeVariantsProps {
    categoryId: number | null;
    availableSizes: SizeDto[];
    loadingSizes: boolean;
    errorSizes: string | null;
    sizeVariants: SizeVariant[];
    onToggleSize: (sizeId: number, sizeName: string) => void;
    onUpdateStock: (sizeId: number, stockCount: number) => void;
}

export function AddProductSizeVariants({
                                           categoryId,
                                           availableSizes,
                                           loadingSizes,
                                           errorSizes,
                                           sizeVariants,
                                           onToggleSize,
                                           onUpdateStock,
                                       }: AddProductSizeVariantsProps) {
    if (!categoryId) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tailles et stocks</h3>
                <div className="text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                    Sélectionnez d'abord une catégorie pour afficher les tailles disponibles
                </div>
            </div>
        );
    }

    if (loadingSizes) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tailles et stocks</h3>
                <div className="flex items-center justify-center gap-2 text-gray-500 p-4">
                    <Loader2 size={20} className="animate-spin" />
                    Chargement des tailles...
                </div>
            </div>
        );
    }

    if (errorSizes) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tailles et stocks</h3>
                <div className="text-red-500 bg-red-50 rounded-lg p-4">{errorSizes}</div>
            </div>
        );
    }

    if (availableSizes.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tailles et stocks</h3>
                <div className="text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                    Aucune taille disponible pour cette catégorie
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tailles et stocks</h3>
            <p className="text-sm text-gray-600">
                Sélectionnez les tailles disponibles et définissez leurs stocks
            </p>

            <div className="space-y-3">
                {availableSizes.map((size) => {
                    const variant = sizeVariants.find((v) => v.sizeId === size.id);
                    const isSelected = !!variant;

                    return (
                        <div key={size.id} className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => onToggleSize(size.id, size.name)}
                                className={`px-4 py-2 border-2 rounded-lg font-medium transition min-w-[80px] ${
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