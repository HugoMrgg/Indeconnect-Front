import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    fetchProductById,
    fetchProductVariants,
    fetchProductColorVariants,
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
import { NavBar } from "@/features/navbar/NavBar";
import { BackLink } from "@/components/ui/BackLink";
import { ProductLoading } from "@/features/product/ProductLoading";

import { addVariantToCart } from "@/api/services/cart";
import { useAuth } from "@/hooks/useAuth";
import { useCartUI } from "@/hooks/useCartUI"; // ← AJOUTER
import { AddToCartModal } from "@/features/cart/AddToCartModal";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import { ProductInfo } from "@/pages/products/ProductInfo";
import toast from "react-hot-toast"; // ← AJOUTER (si pas déjà importé)

export function ProductPage() {
    const { productId, brandName } = useParams();
    const id = Number(productId);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openCart } = useCartUI(); // ← AJOUTER

    const decodedBrand = decodeURIComponent(brandName ?? "");

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | undefined>();

    useEffect(() => {
        setSelectedSize(sizeVariants[0]);
    }, [sizeVariants]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const prod = await fetchProductById(id);
            setProduct(prod);
            setColorVariants(await fetchProductColorVariants(id));
            setSizeVariants(await fetchProductVariants(id));
            setLoading(false);
        }
        void load();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            if (!user?.id) throw new Error("Non authentifié");
            if (!selectedSize) throw new Error("Sélectionnez une taille");

            // ✅ Ajout au panier
            await addVariantToCart(user.id, selectedSize.id, quantity);

            // ✅ Fermer la modale de confirmation
            setIsCartModalOpen(false);

            // ✅ Reset quantité
            setQuantity(1);

            // ✅ Toast de succès
            toast.success("Produit ajouté au panier !", {
                icon: "🛒",
                duration: 2000,
            });

            // ✅ Ouvrir le panier après un court délai (pour voir le toast)
            setTimeout(() => {
                openCart();
            }, 300);

        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message);
            }
        }
    };

    if (loading || !product) return <ProductLoading name={decodedBrand} />;

    return (
        <div className="min-h-screen bg-white">
            <BannerBrand name={decodedBrand} />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ProductImageGallery images={product.media} />

                    <div>
                        <ProductInfo product={product} brandName={decodedBrand} />

                        <ProductColorSelector
                            current={product.primaryColor}
                            variants={colorVariants}
                            onSelect={(v) => navigate(`/brand/${encodeURIComponent(decodedBrand)}/product/${v.productId}`)}
                        />

                        <ProductSizeSelector
                            variants={sizeVariants}
                            selected={selectedSize}
                            onSelect={setSelectedSize}
                        />

                        <AddToCartButton
                            isAvailable={product.isAvailable}
                            onClick={() => setIsCartModalOpen(true)}
                        />

                        <div className="mt-10 text-gray-700">
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p>{product.description}</p>
                        </div>

                        <div className="mt-10">
                            <BackLink />
                        </div>
                    </div>
                </div>

                <ProductReviewsSection productId={id} />
            </div>

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

            <NavBar />
        </div>
    );
}
