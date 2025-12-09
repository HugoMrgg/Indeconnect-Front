    import { Heart, IdCard, MapPin } from "lucide-react";
    import { Brand, EditableBrandFields } from "@/types/brand";  // ✅ AJOUT
    import React from "react";
    import { useBrandSubscription } from "@/hooks/Brand/useBrandSubscription";
    import { EditableField } from "@/features/brands/edit/EditableField";
    import { EditableSelect } from "@/features/brands/edit/EditableSelect";
    import { EditableColorPicker } from "@/features/brands/edit/EditableColorPicker";

    interface Props {
        brand?: Brand;
        editMode?: boolean;
        onUpdateField?: <K extends keyof EditableBrandFields>(field: K, value: EditableBrandFields[K]) => void;  // ✅ CHANGÉ
    }

    const PRICE_RANGE_OPTIONS = [
        { value: "€", label: "€ - Économique" },
        { value: "€€", label: "€€ - Moyen" },
        { value: "€€€", label: "€€€ - Premium" }
    ];

    export const BrandHeader: React.FC<Props> = ({ brand, editMode = false, onUpdateField }) => {
        const { isSubscribed, loading, toggleSubscription } = useBrandSubscription(brand?.id);

        if (!brand) return null;

        return (
            <div className="space-y-6 my-8">
                {/* Section principale */}
                <div className="flex justify-between">
                    {/* Infos marque */}
                    <div className="flex-1">
                        <EditableField
                            value={brand.name}
                            onChange={(value) => onUpdateField?.("name", value)}
                            placeholder="Nom de la marque"
                            className="text-2xl font-bold text-gray-900"
                            editMode={editMode}
                        />

                        <div className="mt-2">
                            <EditableField
                                value={brand.description}
                                onChange={(value) => onUpdateField?.("description", value)}
                                placeholder="Description de votre marque..."
                                className="text-gray-600 leading-relaxed max-w-2xl block"
                                multiline
                                editMode={editMode}
                            />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                <MapPin size={16} />
                                <EditableField
                                    value={brand.address}
                                    onChange={(value) => onUpdateField?.("address", value)}
                                    placeholder="Adresse"
                                    className="bg-transparent"
                                    editMode={editMode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Boutons (masqués en mode édition) */}
                    {!editMode && (
                        <div className="flex flex-col gap-3 text-base">
                            <button
                                onClick={toggleSubscription}
                                disabled={loading}
                                className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Heart
                                    className={`w-6 h-6 transition-all ${
                                        isSubscribed ? "text-red-500 scale-110" : "text-gray-700"
                                    }`}
                                    fill={isSubscribed ? "currentColor" : "none"}
                                />
                                <span>{loading ? "..." : isSubscribed ? "Abonné ✓" : "S'abonner"}</span>
                            </button>

                            <button className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97]">
                                <IdCard className="w-6 h-6 text-gray-700" />
                                <span>Contact</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Sections éditables supplémentaires (visibles seulement en mode édition) */}
                {editMode && onUpdateField && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-gray-50 rounded-xl">
                        {/* À propos */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                À propos
                            </label>
                            <EditableField
                                value={brand.aboutUs}
                                onChange={(value) => onUpdateField("aboutUs", value)}
                                placeholder="Racontez l'histoire de votre marque..."
                                multiline
                                className="text-gray-600 text-sm"
                                editMode={editMode}
                            />
                        </div>

                        {/* Où nous trouver */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Où nous trouver
                            </label>
                            <EditableField
                                value={brand.whereAreWe}
                                onChange={(value) => onUpdateField("whereAreWe", value)}
                                placeholder="Informations sur vos points de vente..."
                                multiline
                                className="text-gray-600 text-sm"
                                editMode={editMode}
                            />
                        </div>

                        {/* Autres infos */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Autres informations
                            </label>
                            <EditableField
                                value={brand.otherInfo}
                                onChange={(value) => onUpdateField("otherInfo", value)}
                                placeholder="Certifications, engagements..."
                                multiline
                                className="text-gray-600 text-sm"
                                editMode={editMode}
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contact
                            </label>
                            <EditableField
                                value={brand.contact}
                                onChange={(value) => onUpdateField("contact", value)}
                                placeholder="email@exemple.com, +32 123 456 789"
                                className="text-gray-600 text-sm"
                                editMode={editMode}
                            />
                        </div>

                        {/* Gamme de prix */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Gamme de prix
                            </label>
                            <EditableSelect
                                value={brand.priceRange}
                                onChange={(value) => onUpdateField("priceRange", value)}
                                options={PRICE_RANGE_OPTIONS}
                                placeholder="Sélectionnez une gamme"
                                editMode={editMode}
                            />
                        </div>

                        {/* Couleur d'accent */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Couleur d'accent
                            </label>
                            <EditableColorPicker
                                value={brand.accentColor}
                                onChange={(value) => onUpdateField("accentColor", value)}
                                editMode={editMode}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };
