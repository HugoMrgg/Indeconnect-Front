import React from "react";

// Liste des couleurs disponibles (pourrait être déplacé dans un fichier de constants)
const AVAILABLE_COLORS = [
    { id: 1, name: "Noir", hexa: "#000000" },
    { id: 2, name: "Blanc", hexa: "#FFFFFF" },
    { id: 3, name: "Rouge", hexa: "#FF0000" },
    { id: 4, name: "Bleu", hexa: "#0000FF" },
    { id: 5, name: "Vert", hexa: "#00FF00" },
    { id: 6, name: "Jaune", hexa: "#FFFF00" },
];

interface AddProductColorSelectorProps {
    selectedColorId: number | null;
    onSelectColor: (colorId: number) => void;
}

export function AddProductColorSelector({
    selectedColorId,
    onSelectColor,
}: AddProductColorSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Couleur de cette variante</h3>
            <div className="grid grid-cols-3 gap-3">
                {AVAILABLE_COLORS.map((color) => (
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
