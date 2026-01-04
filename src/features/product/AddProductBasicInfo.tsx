import React from "react";
import { useTranslation } from "react-i18next";

interface ProductFormData {
    name: string;
    description: string;
}

interface AddProductBasicInfoProps {
    formData: ProductFormData;
    onUpdateField: <K extends keyof ProductFormData>(
        field: K,
        value: ProductFormData[K]
    ) => void;
}

export function AddProductBasicInfo({ formData, onUpdateField }: AddProductBasicInfoProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('add_product.basic_info.title')}</h3>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {t('add_product.basic_info.name_label')} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onUpdateField("name", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t('add_product.basic_info.name_placeholder')}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {t('add_product.basic_info.description_label')} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onUpdateField("description", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={4}
                    placeholder={t('add_product.basic_info.description_placeholder')}
                    required
                />
            </div>
        </div>
    );
}