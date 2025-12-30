import React from "react";
import { useCategories } from "@/hooks/Categories/useCategories";

interface AddProductCategorySelectorProps {
    selectedCategoryId: number | null;
    onSelectCategory: (categoryId: number) => void;
}

export function AddProductCategorySelector({
                                               selectedCategoryId,
                                               onSelectCategory,
                                           }: AddProductCategorySelectorProps) {
    const { categories, loading, error } = useCategories();

    if (loading) {
        return (
            <div className="space-y-4">
            <h3 className="font-semibold text-lg">Catégorie du produit</h3>
        <div className="text-gray-500">Chargement des catégories...</div>
        </div>
    );
    }

    if (error) {
        return (
            <div className="space-y-4">
            <h3 className="font-semibold text-lg">Catégorie du produit</h3>
        <div className="text-red-500">{error}</div>
            </div>
    );
    }

    return (
        <div className="space-y-4">
        <h3 className="font-semibold text-lg">
            Catégorie du produit <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600">
        Sélectionnez la catégorie pour afficher les tailles disponibles
    </p>
    <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
                <button
                    key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
    className={`p-4 border-2 rounded-lg text-left transition ${
        selectedCategoryId === category.id
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-200 hover:border-gray-300"
    }`}
>
    <span className="font-medium">{category.name}</span>
        </button>
))}
    </div>
    </div>
);
}