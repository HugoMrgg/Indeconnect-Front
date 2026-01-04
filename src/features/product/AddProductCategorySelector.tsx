import React from "react";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/hooks/Categories/useCategories";

interface AddProductCategorySelectorProps {
    selectedCategoryId: number | null;
    onSelectCategory: (categoryId: number) => void;
}

export function AddProductCategorySelector({
                                               selectedCategoryId,
                                               onSelectCategory,
                                           }: AddProductCategorySelectorProps) {
    const { t } = useTranslation();
    const { categories, loading, error } = useCategories();

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('add_product.category.title')}</h3>
                <div className="text-gray-500">{t('add_product.category.loading')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('add_product.category.title')}</h3>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">
                {t('add_product.category.title')} <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600">
                {t('add_product.category.description')}
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