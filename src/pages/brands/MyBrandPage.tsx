import React, { useState, useMemo, useCallback } from "react";
import { useMyBrand } from "@/hooks/BrandEdit/useMyBrand";
import { useBrandEditing } from "@/hooks/BrandEdit/useBrandEditing";
import { BrandPage } from "@/pages/brands/Brand";
import { Brand } from "@/types/brand";
import { Save, Loader2, X } from "lucide-react";
import { PreviewModal } from "@/features/brands/PreviewModal";
import { BrandInfoContent } from "@/features/brands/BrandInfoContent";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { DepositModal } from "@/features/brands/DepositModal";
import { ShippingMethodsManager } from "@/features/checkout/ShippingMethodsManager";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import { BrandEthicsCallout } from "@/features/brands/BrandEthicsCallout";
import { AddProductForm } from "@/features/product/AddProductForm";
import { createProduct } from "@/api/services/products";
import { CreateProductRequest } from "@/api/services/products/types";
import { useAuthContext } from "@/hooks/Auth/useAuthContext";
import { PageSkeleton } from "@/components/skeletons";
import { logger } from "@/utils/logger";
import { VendorManagementSection } from "@/features/vendors/VendorManagementSection";
import {BrandStatusBadge} from "@/features/brands/BrandStatusBadge";
import {BrandStatus} from "@/api/services/brands/types";
import {BrandSubmitSection} from "@/features/brands/BrandSubmitSection";

export function MyBrandPage() {
    const { userRole } = useAuthContext();
    const isVendor = userRole === "Vendor";

    const { brand, loading, error, refetch } = useMyBrand();
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState<"products" | "about" | "shipping" | "team">("products");
    const [depositModalOpen, setDepositModalOpen] = useState(false);
    const [ethicsModalOpen, setEthicsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddProduct, setShowAddProduct] = useState(false);

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
        if (success) await refetch();
    };

    const handleCreateProduct = useCallback(
        async (data: CreateProductRequest) => {
            try {
                await createProduct(data);
                setShowAddProduct(false);
                setTimeout(() => {
                    refetch();
                }, 300);
            } catch (error) {
                logger.error("MyBrandPage.handleCreateProduct", error);
                throw error;
            }
        },
        [refetch]
    );

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
        return <PageSkeleton />;
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
            {/* Barre d'actions fixe - cachée pour les Vendors */}
            {!isVendor && editing.hasChanges && (
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
            <div className={!isVendor && editing.hasChanges ? "pt-16" : ""}>
                {/* Tabs - cachés pour les Vendors qui voient uniquement les produits */}
                {!isVendor && (
                    <div className="bg-gradient-to-b from-gray-50 to-white py-4">
                        {/* ➕ NOUVEAU - Badge de status */}
                        {brand.status && (
                            <div className="mx-auto max-w-3xl px-4 mb-4">
                                <BrandStatusBadge status={brand.status as BrandStatus} />
                            </div>
                        )}
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

                                    {userRole === "SuperVendor" && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("team")}
                                            className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                                                activeTab === "team"
                                                    ? "bg-white text-gray-900 shadow-sm"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            Équipe
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Section de soumission (visible uniquement pour SuperVendor) */}
                {!isVendor && brand.status && (
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
                        <BrandSubmitSection
                            brandId={brand.id}
                            status={brand.status as BrandStatus}
                            latestRejectionComment={brand.latestRejectionComment}
                            onSubmitted={refetch}
                        />
                    </div>
                )}
                {/* Onglet Produits - toujours affiché pour les Vendors */}
                {(activeTab === "products" || isVendor) && (
                    <>
                        {(() => {
                            const isWaitingValidation =
                                brand.status === "Submitted" ||
                                brand.status === "PendingUpdate";

                            const canEdit = !isVendor && !isWaitingValidation;

                            return (
                                <BrandPage
                                    brandId={brand.id}
                                    brandData={displayBrand}
                                    editMode={canEdit}
                                    canManageProducts={true}
                                    onUpdateField={canEdit ? editing.updateField : undefined}
                                    onAddProduct={() => setShowAddProduct(true)}
                                />
                            );
                        })()}


                        {showAddProduct && (
                            <AddProductForm
                                brandId={brand.id}
                                onSuccess={() => {
                                    setShowAddProduct(false);
                                    setTimeout(() => refetch(), 300);
                                }}
                                onCancel={() => setShowAddProduct(false)}
                                onSubmit={handleCreateProduct}
                            />
                        )}
                    </>
                )}

                {/* Onglet Présentation - caché pour les Vendors */}
                {!isVendor && activeTab === "about" && (
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

                {/* Onglet Livraison - caché pour les Vendors */}
                {!isVendor && activeTab === "shipping" && (
                    <div className="min-h-full bg-gradient-to-b from-gray-50 to-white py-8">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                                <ShippingMethodsManager brandId={brand.id} editMode={true} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Onglet Équipe - SuperVendor uniquement */}
                {!isVendor && userRole === "SuperVendor" && activeTab === "team" && (
                    <VendorManagementSection brandId={brand.id} />
                )}
            </div>

            <DepositModal
                open={depositModalOpen}
                onClose={() => setDepositModalOpen(false)}
                initialDeposit={mainDeposit}
                onSaved={async () => {
                    if (!editing.hasChanges) await refetch();
                }}
            />

            {showPreview && displayBrand && (
                <PreviewModal brand={displayBrand} onClose={() => setShowPreview(false)} />
            )}

            <AuthPanel />
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
}
