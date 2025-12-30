import React from "react";

interface ProductBasicInfoEditorProps {
    name: string;
    description: string;
    price: number;
    onUpdateName: (value: string) => void;
    onUpdateDescription: (value: string) => void;
    onUpdatePrice: (value: number) => void;
}

export function ProductBasicInfoEditor({
                                           name,
                                           description,
                                           price,
                                           onUpdateName,
                                           onUpdateDescription,
                                           onUpdatePrice,
                                       }: ProductBasicInfoEditorProps) {
    return (
        <div className="space-y-6 bg-gray-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-600">MODE ÉDITION</span>
            </div>

            {/* Nom du produit */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Nom du produit <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-semibold"
                    placeholder="Ex: T-shirt Organic Cotton - Red"
                    required
                />
            </div>

            {/* Prix */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Prix (€) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => onUpdatePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-2xl font-bold"
                    placeholder="0.00"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => onUpdateDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    rows={6}
                    placeholder="Décrivez votre produit en détail..."
                    required
                />
                <p className="text-sm text-gray-500 mt-2">
                    {description.length} caractères
                </p>
            </div>
        </div>
    );
}