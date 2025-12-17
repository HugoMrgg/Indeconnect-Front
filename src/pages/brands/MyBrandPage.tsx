import React, { useState, useMemo } from "react";
import { useMyBrand } from "@/hooks/BrandEdit/useMyBrand";
import { useBrandEditing } from "@/hooks/BrandEdit/useBrandEditing";
import { BrandPage } from "@/pages/brands/Brand";
import { Brand } from "@/types/brand";
import { Save, Loader2, X } from "lucide-react";
import { PreviewModal } from "@/features/brands/PreviewModal";
import { BrandInfoContent } from "@/features/brands/BrandInfoContent";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { DepositModal } from "@/features/brands/DepositModal";
import { NavBar } from "@/features/navbar/NavBar";
import { BrandEthicsCallout } from "@/features/brands/BrandEthicsCallout";
import { BrandEthicsQuestionnaireModal } from "@/features/brands/BrandEthicsQuestionnaireModal";

export function MyBrandPage() {
    const { brand, loading, error, refetch } = useMyBrand();
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState<"products" | "about">("products");
    const [depositModalOpen, setDepositModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // pour gérer l'ouverture du modal d'éthique (à implémenter plus tard)
    const [ethicsModalOpen, setEthicsModalOpen] = useState(false);

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
                    <div className="mx-auto max-w-md px-4">
                        <div className="bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("products")}
                                    className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
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
                                    className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                                        activeTab === "about"
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Présentation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Onglet Produits : BrandPage en mode édition */}
                {activeTab === "products" && (
                    <BrandPage
                        brandId={brand.id}
                        brandData={displayBrand}
                        editMode={true}
                        onUpdateField={editing.updateField}
                    />
                )}

                {/* Onglet Présentation : même layout que BrandInfoPage mais éditable */}
                {activeTab === "about" && (
                    <div className="min-h-full bg-gradient-to-b from-gray-50 to-white">
                        <BannerBrand
                            name={displayBrand.name}
                            bannerUrl={displayBrand.bannerUrl ?? null}
                            editMode={true}
                            onUpdate={(url) => editing.updateField("bannerUrl", url)}
                        />

                        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 -mt-10 relative">
                            <BrandInfoContent
                                brand={{
                                    name: displayBrand.name,
                                    logoUrl: displayBrand.logoUrl ?? null,
                                    bannerUrl: displayBrand.bannerUrl ?? null,
                                    description: displayBrand.description ?? null,
                                    aboutUs: displayBrand.aboutUs ?? null,
                                    whereAreWe: displayBrand.whereAreWe ?? null,
                                    otherInfo: displayBrand.otherInfo ?? null,
                                    contact: displayBrand.contact ?? null,
                                    priceRange: displayBrand.priceRange ?? null,
                                }}
                                editMode={true}
                                onUpdateField={editing.updateField}
                                mainDeposit={mainDeposit}
                                onEditDeposit={() => setDepositModalOpen(true)}
                                rightBottomAddon={
                                    <BrandEthicsCallout
                                        brandId={brand.id}
                                        ethicsScoreProduction={brand.ethicsScoreProduction}
                                        ethicsScoreTransport={brand.ethicsScoreTransport}
                                        ethicTags={brand.ethicTags}
                                        onOpen={() => setEthicsModalOpen(true)}
                                    />
                                }
                            />
                        </main>
                    </div>
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

            <BrandEthicsQuestionnaireModal
                brandId={brand.id}
                open={ethicsModalOpen}
                onClose={() => setEthicsModalOpen(false)}
                searchQuery={searchQuery}
                onSubmitted={() => {
                    // optionnel : ici tu peux forcer un refresh visuel si besoin
                    // ex: setSearchQuery(s => s) ou autre
                }}
            />

            {/* NavBar ajoutée */}
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
}
