import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    fetchProductById,
    fetchProductVariants,
    fetchProductColorVariants,
    checkCanUserReview
} from "@/api/services/products";

import {
    ProductDetail,
    ColorVariant,
    SizeVariant,
} from "@/types/Product";

import { ProductImageGallery } from "@/features/product/ProductImageGallery";
import { ProductColorSelector } from "@/features/product/ProductColorSelector";
import { ProductSizeSelector } from "@/features/product/ProductSizeSelector";
import { ProductReviewsSection } from "@/features/product/ProductReviewsSection";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import { BackLink } from "@/components/ui/BackLink";
import { ProductLoading } from "@/features/product/ProductLoading";
import { ProductInfo } from "@/pages/products/ProductInfo";

import { addVariantToCart } from "@/api/services/cart";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useCartUI } from "@/hooks/User/useCartUI";
import { AddToCartModal } from "@/features/cart/AddToCartModal";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import { useBrands } from "@/hooks/Brand/useBrands";
import toast from "react-hot-toast";

// NOUVEAUX IMPORTS POUR EDIT MODE
import { ProductMediaManager } from "@/features/product/ProductMediaManager";
import { ProductBasicInfoEditor } from "@/features/product/ProductBasicInfoEditor";
import { ProductEditPanel } from "@/features/product/ProductEditPanel";
import { ProductColorEditor } from "@/features/product/ProductColorEditor";
import { ProductVariantsManager } from "@/features/product/ProductVariantsManager";
import { useProductEditing } from "@/hooks/Product/useProductEditing";
import {FrequentlyBoughtTogetherSection} from "@/features/recommendations/FrequentlyBoughtTogetherSection";

interface ProductPageProps {
    editMode?: boolean;
}

export function ProductPage({ editMode = false }: ProductPageProps) {
    const { productId, brandName } = useParams();
    const id = Number(productId);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openCart } = useCartUI();

    const decodedBrand = brandName ? decodeURIComponent(brandName) : "";

    const { brands } = useBrands();
    const brand = brands.find(b => b.name === decodedBrand);

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | undefined>();
    const [canReview, setCanReview] = useState(false);

    // Hook d'édition (seulement en mode edit)
    const editing = useProductEditing(
        editMode ? id : null,
        product
    );

    useEffect(() => {
        if (sizeVariants.length > 0) {
            setSelectedSize(sizeVariants[0]);
        }
    }, [sizeVariants]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const prod = await fetchProductById(id);
                setProduct(prod);
                setColorVariants(await fetchProductColorVariants(id));
                setSizeVariants(await fetchProductVariants(id));
            } catch (e) {
                setError(e instanceof Error ? e.message : "Erreur lors du chargement du produit");
            } finally {
                setLoading(false);
            }
        }
        void load();
    }, [id]);

    useEffect(() => {
        if (user && id && !editMode) {
            checkCanUserReview(id).then((allowed) => {
                setCanReview(allowed);
            });
        } else {
            setCanReview(false);
        }
    }, [user, id, editMode]);

    const handleAddToCart = async () => {
        try {
            if (!user?.id) throw new Error("Non authentifié");
            if (!selectedSize) throw new Error("Sélectionnez une taille");

            await addVariantToCart(user.id, selectedSize.id, quantity);
            setIsCartModalOpen(false);
            setQuantity(1);

            toast.success("Produit ajouté au panier !", {
                icon: "🛒",
                duration: 2000,
            });

            setTimeout(() => {
                openCart();
            }, 300);

        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message);
            }
        }
    };

    const handleSaveProduct = async () => {
        if (!editMode || !editing) return;

        const success = await editing.save();
        if (success) {
            toast.success("Produit mis à jour !", { icon: "✅" });
            // Recharger le produit
            const updatedProduct = await fetchProductById(id);
            setProduct(updatedProduct);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !product) {
        return <ProductLoading
            name={decodedBrand}
            productName={product?.name}
            bannerUrl={brand?.bannerUrl}
        />;
    }

    return (
        <div className="min-h-screen bg-white">
            <BannerBrand
                name={editMode ? "Ma Marque" : decodedBrand}
                bannerUrl={brand?.bannerUrl}
            />

            {/* Barre d'actions fixe en mode édition */}
            {editMode && editing?.hasChanges && (
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
                                onClick={handleSaveProduct}
                                disabled={editing.saving}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                            >
                                {editing.saving ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`max-w-6xl mx-auto px-4 py-10 ${editMode && editing?.hasChanges ? 'pt-24' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* IMAGES - Conditionnel selon editMode */}
                    {editMode && editing ? (
                        <ProductMediaManager
                            media={editing.formData.media || []}
                            onMediaUpdate={(newMedia) => editing.updateField('media', newMedia)}
                        />
                    ) : (
                        <ProductImageGallery images={product.media} />
                    )}

                    <div>
                        {/* INFO DE BASE - Conditionnel selon editMode */}
                        {editMode && editing ? (
                            <ProductBasicInfoEditor
                                name={editing.formData.name}
                                description={editing.formData.description}
                                price={editing.formData.price}
                                onUpdateName={(value) => editing.updateField('name', value)}
                                onUpdateDescription={(value) => editing.updateField('description', value)}
                                onUpdatePrice={(value) => editing.updateField('price', value)}
                            />
                        ) : (
                            <ProductInfo product={product} brandName={decodedBrand} />
                        )}

                        {/* COULEUR - Conditionnel selon editMode */}
                        {editMode && editing ? (
                            <ProductColorEditor
                                currentColorId={editing.formData.primaryColorId}
                                onSelectColor={(colorId) => editing.updateField('primaryColorId', colorId)}
                            />
                        ) : (
                            <ProductColorSelector
                                current={product.primaryColor}
                                variants={colorVariants}
                                onSelect={(v) => navigate(`/brand/${encodeURIComponent(decodedBrand)}/product/${v.productId}`)}
                            />
                        )}

                        {/* TAILLES - Conditionnel selon editMode */}
                        {editMode && editing ? (
                            <ProductVariantsManager
                                productId={id}
                                categoryId={product.categoryId}
                                variants={editing.formData.variants || []}
                                onVariantsUpdate={(newVariants) => editing.updateField('variants', newVariants)}
                            />
                        ) : (
                            <>
                                <ProductSizeSelector
                                    variants={sizeVariants}
                                    selected={selectedSize}
                                    onSelect={setSelectedSize}
                                />

                                <AddToCartButton
                                    isAvailable={
                                        selectedSize?.isAvailable === true &&
                                        selectedSize.stockCount > 0
                                    }
                                    onClick={() => setIsCartModalOpen(true)}
                                />
                            </>
                        )}

                        {/* Description (en mode client, déjà dans ProductInfo en mode edit) */}
                        {!editMode && (
                            <div className="mt-10 text-gray-700">
                                <h2 className="text-xl font-semibold mb-3">Description</h2>
                                <p>{product.description}</p>
                            </div>
                        )}

                        <div className="mt-10">
                            <BackLink />
                        </div>
                    </div>
                </div>

                {/* Reviews (masqué en mode edit) */}
                {!editMode && (
                    <>
                        <FrequentlyBoughtTogetherSection productId={id} />

                        <ProductReviewsSection
                            productId={id}
                            canReview={canReview}
                        />
                    </>
                )}
            </div>

            {/* Panel d'édition latéral (seulement en editMode) */}
            {editMode && editing && (
                <ProductEditPanel
                    productId={id}
                    status={editing.formData.status}
                    sale={editing.formData.sale}
                    onStatusChange={(status) => editing.updateField('status', status)}
                    onSaleChange={(sale) => editing.updateField('sale', sale)}
                    onSave={handleSaveProduct}
                    hasChanges={editing.hasChanges}
                    saving={editing.saving}
                />
            )}

            {/* Modal panier (seulement en mode client) */}
            {!editMode && (
                <AddToCartModal
                    open={isCartModalOpen}
                    product={product}
                    brandName={decodedBrand}
                    selectedSize={selectedSize}
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    onClose={() => setIsCartModalOpen(false)}
                    onConfirm={handleAddToCart}
                />
            )}

            <AuthPanel />
            <NavBar />
        </div>
    );
}
