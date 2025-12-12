import React from "react";

interface EditableColorPickerProps {
    value: string | null | undefined;
    onChange: (color: string | null) => void;
    editMode: boolean;
}

export const EditableColorPicker: React.FC<EditableColorPickerProps> = ({
                                                                            value,
                                                                            onChange,
                                                                            editMode
                                                                        }) => {
    if (!editMode) {
        return (
            <div className="flex items-center gap-2">
                {value && (
                    <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value }}
                    />
                )}
                <span className="text-sm text-gray-600">
                    {value || "Aucune couleur"}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <input
                    type="color"
                    value={value || "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
            </div>
            <div className="flex flex-col">
                <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => {
                        const hex = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                            onChange(hex);
                        }
                    }}
                    placeholder="#000000"
                    className="px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    maxLength={7}
                />
                <span className="text-xs text-gray-500 mt-1">
                    Couleur d'accent de votre marque
                </span>
            </div>
            {value && (
                <button
                    onClick={() => onChange(null)}
                    className="text-sm text-red-600 hover:text-red-700"
                >
                    Supprimer
                </button>
            )}
        </div>
    );
};
