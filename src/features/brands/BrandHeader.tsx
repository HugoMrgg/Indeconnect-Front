import { Heart, IdCard, MapPin } from "lucide-react";
import { Brand, EditableBrandFields } from "@/types/brand";
import React from "react";
import { useTranslation } from "react-i18next";
import { useBrandSubscription } from "@/hooks/Brand/useBrandSubscription";
import { EditableField } from "@/features/brands/edit/EditableField";
import { useNavigate } from "react-router-dom";
import { EditableLogo } from "@/features/brands/edit/EditableLogo";

interface Props {
    brand?: Brand;
    editMode?: boolean;
    onUpdateField?: <K extends keyof EditableBrandFields>(
        field: K,
        value: EditableBrandFields[K]
    ) => void;
}

export const BrandHeader: React.FC<Props> = ({
                                                 brand,
                                                 editMode = false,
                                                 onUpdateField,
                                             }) => {
    const { t } = useTranslation();
    const { isSubscribed, loading, toggleSubscription } = useBrandSubscription(
        brand?.id
    );
    const navigate = useNavigate();

    if (!brand) return null;

    return (
        <div className="space-y-6 my-8">
            {/* Section principale */}
            <div className="flex justify-between gap-6">
                {/* Infos marque */}
                <div className="flex-1 flex items-start gap-4">
                    {/* Logo éditable / ou juste affiché côté client */}
                    <div className="shrink-0">
                        <EditableLogo
                            logoUrl={brand.logoUrl}
                            editMode={!!editMode}
                            onUpdateField={onUpdateField}
                        />
                    </div>

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
                                    value={brand.address || brand.mainCity || null}
                                    onChange={(value) => onUpdateField?.("address", value)}
                                    placeholder={brand.mainCity || "Adresse"}
                                    className="bg-transparent"
                                    editMode={editMode}
                                />
                            </div>
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
                            <span>
                {loading ? "..." : isSubscribed ? t('brands.subscribed') : t('brands.subscribe')}
              </span>
                        </button>

                        <button
                            className="inline-flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition active:scale-[0.97]"
                            onClick={() =>
                                navigate(`/brand/${encodeURIComponent(brand.name)}/info`)
                            }
                        >
                            <IdCard className="w-6 h-6 text-gray-700" />
                            <span>{t('brands.about_us')}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};