import React, { useState } from "react";
import { EditableBrandFields } from "@/types/brand";
import { ImageUploader } from "@/features/brands/ImageUploader";

interface EditableLogoProps {
    logoUrl: string | null | undefined;
    editMode: boolean;
    onUpdateField?: <K extends keyof EditableBrandFields>(
        field: K,
        value: EditableBrandFields[K]
    ) => void;
}

export const EditableLogo: React.FC<EditableLogoProps> = ({
                                                              logoUrl,
                                                              editMode,
                                                              onUpdateField,
                                                          }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!editMode || !onUpdateField) {
        if (!logoUrl) return null;

        return (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img
                    src={logoUrl}
                    alt="Logo de la marque"
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                />
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden relative group"
            >
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt="Logo de la marque"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                    />
                ) : (
                    <span className="text-xs text-gray-400 text-center px-2">
                        Ajouter un logo
                    </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 text-[11px] text-white flex items-center justify-center text-center px-2 transition">
                    Modifier le logo
                </div>
            </button>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-semibold mb-4">Modifier le logo</h3>

                        <ImageUploader
                            label="Logo"
                            currentUrl={logoUrl ?? null}
                            onUpload={(url) => {
                                onUpdateField("logoUrl", url);
                                setIsEditing(false);
                            }}
                            aspectRatio="square"
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
