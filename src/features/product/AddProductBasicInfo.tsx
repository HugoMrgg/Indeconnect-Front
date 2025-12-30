import React from "react";

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
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations générales</h3>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Nom du produit <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onUpdateField("name", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: T-shirt Streetwear"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onUpdateField("description", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={4}
                    placeholder="Décrivez votre produit..."
                    required
                />
            </div>
        </div>
    );
}