import React, { useState, useMemo } from "react";
import { useMyBrand } from "@/hooks/BrandEdit/useMyBrand";
import { useBrandEditing } from "@/hooks/BrandEdit/useBrandEditing";
import { Brand } from "@/types/brand";
import { Save, Loader2, X } from "lucide-react";
import { PreviewModal } from "@/features/brands/PreviewModal";
import { DepositModal } from "@/features/brands/DepositModal";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

// Onglets
import { MyBrandProductsTab } from "@/features/brands/MyBrandProductsTab";
import { MyBrandAboutTab } from "@/features/brands/MyBrandAboutTab";
import { MyBrandShippingTab } from "@/features/brands/MyBrandShippingTab";

export function MyBrandPage() {
    const { brand, loading, error, refetch } = useMyBrand();
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState<"products" | "about" | "shipping">("products");
    const [depositModalOpen, setDepositModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
            accentColor: brand.accentColor,
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
            accentColor: null,
        }
    );

    const handleSave = async () => {
        const success = await editing.save();
        if (success) {
            await refetch();
        }
    };

    const displayBrand: Brand | undefined = useMemo(() => {
        if (!brand) return undefined;
        const mainDeposit = brand.deposits[0];

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
            accentColor: editing.formData.accentColor,
            mainCity: mainDeposit?.city ?? null,
        };
    }, [brand, editing.formData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={48} className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !brand || !displayBrand) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <X size={48} className="text-red-500" />
                <p className="text-gray-600">
                    {error || "Aucune marque associée à votre compte"}
                </p>
            </div>
        );
    }

    const mainDeposit = brand.deposits[0] ?? null;

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

            {/* Contenu avec onglets */}
            <div className={editing.hasChanges ? "pt-16" : ""}>
                {/* Onglets - Style segmented control iOS */}
                <div className="bg-gradient-to-b from-gray-50 to-white py-4">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("products")}
                                    className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                                        activeTab === "products"
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Produits
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("about")}
                                    className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                                        activeTab === "about"
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Présentation
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("shipping")}
                                    className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                                        activeTab === "shipping"
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Livraison
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Onglet Produits */}
                {activeTab === "products" && (
                    <MyBrandProductsTab
                        brand={displayBrand}
                        onUpdateField={editing.updateField}
                        onRefetch={refetch}
                    />
                )}

                {/* Onglet Présentation */}
                {activeTab === "about" && (
                    <MyBrandAboutTab
                        brand={displayBrand}
                        mainDeposit={mainDeposit}
                        onUpdateField={editing.updateField}
                        onEditDeposit={() => setDepositModalOpen(true)}
                    />
                )}

                {/* Onglet Livraison */}
                {activeTab === "shipping" && (
                    <MyBrandShippingTab brandId={brand.id} />
                )}
            </div>

            {/* Modal dépôt principal */}
            <DepositModal
                open={depositModalOpen}
                onClose={() => setDepositModalOpen(false)}
                initialDeposit={mainDeposit}
                onSaved={async () => {
                    if (!editing.hasChanges) {
                        await refetch();
                    }
                }}
            />

            {/* Modal Preview client */}
            {showPreview && displayBrand && (
                <PreviewModal
                    brand={displayBrand}
                    onClose={() => setShowPreview(false)}
                />
            )}

            {/* AuthPanel et NavBar */}
            <AuthPanel />
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
}