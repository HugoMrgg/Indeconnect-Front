import React from "react";
import { useColors } from "@/hooks/Color/useColors";

interface AddProductColorSelectorProps {
    selectedColorId: number | null;
    onSelectColor: (colorId: number) => void;
}

export function AddProductColorSelector({
                                            selectedColorId,
                                            onSelectColor,
                                        }: AddProductColorSelectorProps) {
    const { colors, loading, error } = useColors();

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Couleur de cette variante</h3>
                <div className="text-gray-500">Chargement des couleurs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Couleur de cette variante</h3>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Couleur de cette variante</h3>
            <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        type="button"
                        onClick={() => onSelectColor(color.id)}
                        className={`p-3 border-2 rounded-lg flex items-center gap-3 transition ${
                            selectedColorId === color.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.hexa }}
                        />
                        <span className="text-sm font-medium">{color.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}