import React, { useState } from "react";
import { useSizes } from "@/hooks/Sizes/useSizes";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface VariantData {
    sizeId: number;
    sizeName: string;
    stockCount: number;
    id?: number; // Pour les variants existants
}

interface ProductVariantsManagerProps {
    productId: number;
    categoryId: number;
    variants: VariantData[];
    onVariantsUpdate: (variants: VariantData[]) => void;
}

export function ProductVariantsManager({
                                           productId: _productId,
                                           categoryId,
                                           variants,
                                           onVariantsUpdate,
                                       }: ProductVariantsManagerProps) {
    const { sizes: availableSizes, loading, error } = useSizes(categoryId);
    const [showAddSize, setShowAddSize] = useState(false);

    const handleAddVariant = (sizeId: number, sizeName: string) => {
        // Vérifier si la taille n'existe pas déjà
        if (variants.some(v => v.sizeId === sizeId)) {
            return;
        }

        const newVariant: VariantData = {
            sizeId,
            sizeName,
            stockCount: 0,
        };

        onVariantsUpdate([...variants, newVariant]);
        setShowAddSize(false);
    };

    const handleRemoveVariant = (sizeId: number) => {
        onVariantsUpdate(variants.filter(v => v.sizeId !== sizeId));
    };

    const handleUpdateStock = (sizeId: number, stockCount: number) => {
        onVariantsUpdate(
            variants.map(v =>
                v.sizeId === sizeId ? { ...v, stockCount } : v
            )
        );
    };

    if (loading) {
        return (
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Tailles et stocks</h3>
                <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 size={20} className="animate-spin" />
                    Chargement des tailles...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Tailles et stocks</h3>
                <div className="text-red-500 bg-red-50 rounded-lg p-4">{error}</div>
            </div>
        );
    }

    // Tailles disponibles à ajouter (pas encore dans les variants)
    const sizesToAdd = availableSizes.filter(
        size => !variants.some(v => v.sizeId === size.id)
    );

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                    Tailles et stocks <span className="text-red-500">*</span>
                </h3>
                <span className="text-sm text-gray-600">
                    {variants.length} taille(s) disponible(s)
                </span>
            </div>

            {/* Liste des variants existants */}
            <div className="space-y-3">
                {variants.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-600">Aucune taille configurée</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Ajoutez au moins une taille pour ce produit
                        </p>
                    </div>
                ) : (
                    variants.map((variant) => (
                        <div
                            key={variant.sizeId}
                            className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
                        >
                            {/* Badge taille */}
                            <div className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg min-w-[80px] text-center">
                                {variant.sizeName}
                            </div>

                            {/* Input stock */}
                            <div className="flex-1 flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Stock:
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={variant.stockCount}
                                    onChange={(e) =>
                                        handleUpdateStock(
                                            variant.sizeId,
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <span className="text-sm text-gray-600">unités</span>
                            </div>

                            {/* Bouton supprimer */}
                            <button
                                onClick={() => handleRemoveVariant(variant.sizeId)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Supprimer cette taille"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Bouton ajouter une taille */}
            {sizesToAdd.length > 0 && (
                <div className="mt-4">
                    {showAddSize ? (
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-300">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-gray-800">
                                    Sélectionnez une taille
                                </span>
                                <button
                                    onClick={() => setShowAddSize(false)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Annuler
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {sizesToAdd.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => handleAddVariant(size.id, size.name)}
                                        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-blue-500 hover:bg-blue-50 transition"
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddSize(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg text-blue-700 font-semibold hover:bg-blue-100 transition"
                        >
                            <Plus size={20} />
                            Ajouter une taille
                        </button>
                    )}
                </div>
            )}

            {/* Info si toutes les tailles sont déjà ajoutées */}
            {sizesToAdd.length === 0 && variants.length > 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                    Toutes les tailles disponibles pour cette catégorie ont été ajoutées
                </p>
            )}
        </div>
    );
}