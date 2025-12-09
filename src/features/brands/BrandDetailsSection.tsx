import { Edit2 } from "lucide-react";
import { Brand } from "@/types/brand";
import { useState } from "react";

interface Props {
    brand: Brand;
    editMode?: boolean;
    onUpdateField?: <K extends keyof Brand>(field: K, value: Brand[K]) => void;
}

export const BrandDetailsSection = ({ brand, editMode = false, onUpdateField }: Props) => {
    const [editingField, setEditingField] = useState<string | null>(null);

    const EditableSection = ({
                                 title,
                                 value,
                                 field,
                                 placeholder,
                             }: {
        title: string;
        value: string | null | undefined;
        field: keyof Brand;
        placeholder: string;
    }) => {
        const isEditing = editingField === field;
        const hasContent = value && value.trim().length > 0;

        if (!editMode || !onUpdateField) {
            if (!hasContent) return null;
            return (
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{value}</p>
                </section>
            );
        }

        return (
            <section className={`mb-6 p-4 rounded-lg ${editMode ? "hover:bg-gray-50 transition-colors" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {editMode && <Edit2 size={16} className="text-gray-400" />}
                </div>
                {isEditing ? (
                    <textarea
                        autoFocus
                        value={value || ""}
                        onChange={(e) => onUpdateField(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        className="w-full border-2 border-blue-500 rounded-lg px-3 py-2 outline-none min-h-[100px]"
                        placeholder={placeholder}
                    />
                ) : (
                    <p
                        onClick={() => setEditingField(field)}
                        className={`
                            ${hasContent ? "text-gray-600" : "text-gray-400 italic"}
                            whitespace-pre-wrap cursor-pointer
                            hover:outline hover:outline-2 hover:outline-dashed 
                            hover:outline-blue-300 rounded px-2 py-1
                        `}
                    >
                        {value || placeholder}
                    </p>
                )}
            </section>
        );
    };

    return (
        <div className="my-8 space-y-6">
            <EditableSection
                title="À propos"
                value={brand.aboutUs}
                field="aboutUs"
                placeholder="Présentez votre marque en détail..."
            />

            <EditableSection
                title="Où nous trouver"
                value={brand.whereAreWe}
                field="whereAreWe"
                placeholder="Adresses, points de vente..."
            />

            <EditableSection
                title="Contact"
                value={brand.contact}
                field="contact"
                placeholder="Email, téléphone, réseaux sociaux..."
            />

            <EditableSection
                title="Autres informations"
                value={brand.otherInfo}
                field="otherInfo"
                placeholder="Informations complémentaires..."
            />
        </div>
    );
};
