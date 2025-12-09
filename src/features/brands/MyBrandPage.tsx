import React, { useState, useMemo } from "react";
import { useMyBrand } from "@/hooks/BrandEdit/useMyBrand";
import { useBrandEditing } from "@/hooks/BrandEdit/useBrandEditing";
import { BrandPage } from "@/pages/brands/Brand";
import { Brand } from "@/types/brand";
import { Save, Eye, Loader2, X } from "lucide-react";
import { PreviewModal } from "@/features/brands/PreviewModal";

export function MyBrandPage() {
    const { brand, loading, error, refetch } = useMyBrand();
    const [showPreview, setShowPreview] = useState(false);

    // Convertir BrandDetailDTO en UpdateBrandRequest
    const initialData = useMemo(() => {
        if (!brand) return null;
        return {
            name: brand.name,
            logoUrl: brand.logoUrl,
            bannerUrl: brand.bannerUrl,
            description: brand.description,
            aboutUs: brand.aboutUs,
            whereAreWe: brand.whereAreWe,
            otherInfo: brand.otherInfo,
            contact: brand.contact,
            priceRange: brand.priceRange,
            accentColor: brand.accentColor
        };
    }, [brand]);

    const editing = useBrandEditing(
        brand?.id || 0,
        initialData || {
            name: "",
            logoUrl: null,
            bannerUrl: null,
            description: null,
            aboutUs: null,
            whereAreWe: null,
            otherInfo: null,
            contact: null,
            priceRange: null,
            accentColor: null
        }
    );

    const handleSave = async () => {
        const success = await editing.save();
        if (success) {
            await refetch();
        }
    };

    // Données combinées pour l'affichage
    const displayBrand: Brand | undefined = useMemo(() => {
        if (!brand) return undefined;

        return {
            id: brand.id,
            name: editing.formData.name,
            logoUrl: editing.formData.logoUrl,
            bannerUrl: editing.formData.bannerUrl,
            description: editing.formData.description,
            ethicsScoreProduction: brand.ethicsScoreProduction,
            ethicsScoreTransport: brand.ethicsScoreTransport,
            address: brand.address,
            distanceKm: brand.distanceKm,
            userRating: brand.averageUserRating,
            aboutUs: editing.formData.aboutUs,
            whereAreWe: editing.formData.whereAreWe,
            otherInfo: editing.formData.otherInfo,
            contact: editing.formData.contact,
            priceRange: editing.formData.priceRange,
            accentColor: editing.formData.accentColor
        };
    }, [brand, editing.formData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={48} className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !brand) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <X size={48} className="text-red-500" />
                <p className="text-gray-600">{error || "Aucune marque associée à votre compte"}</p>
            </div>
        );
    }

    return (
        <>
            {/* Barre d'actions fixe */}
            {editing.hasChanges && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-lg">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                        <span className="font-medium">Modifications non enregistrées</span>
                        <div className="flex gap-3">
                            <button
                                onClick={editing.discardChanges}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={editing.saving}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                            >
                                {editing.saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton Preview */}
            <button
                onClick={() => {
                    console.log('🔴 Aperçu cliqué !'); // ✅ Pour vérifier
                    setShowPreview(true);
                }}
                className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 transition"
                //                              ^^^^^^^^ Changé de z-40 à z-[60]
            >
                <Eye size={20} />
                Aperçu client
            </button>

            {/* Page d'édition */}
            <div className={editing.hasChanges ? "pt-16" : ""}>
                <BrandPage
                    brandId={brand.id}
                    brandData={displayBrand}
                    editMode={true}
                    onUpdateField={editing.updateField}
                />
            </div>

            {/* Modal Preview */}
            {showPreview && displayBrand && (
                <PreviewModal
                    brand={displayBrand}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
}