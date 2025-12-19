import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { SizeVariant } from "@/types/Product";
import { useProductDetail } from "@/hooks/Product/useProductDetail";

import { ProductImageGallery } from "@/features/product/ProductImageGallery";
import { ProductColorSelector } from "@/features/product/ProductColorSelector";
import { ProductSizeSelector } from "@/features/product/ProductSizeSelector";
import { ProductReviewsSection } from "@/features/product/ProductReviewsSection";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import {BackLink} from "@/components/ui/BackLink";
import {ProductLoading} from "@/features/product/ProductLoading";

import { addVariantToCart } from "@/api/services/cart";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useCartUI } from "@/hooks/User/useCartUI";
import { AddToCartModal } from "@/features/cart/AddToCartModal";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import { ProductInfo } from "@/pages/products/ProductInfo";
import toast from "react-hot-toast";
import {useBrands} from "@/hooks/Brand/useBrands";

export function ProductPage() {
    const { productId, brandName } = useParams();
    const id = Number(productId);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openCart } = useCartUI();

    const decodedBrand = decodeURIComponent(brandName ?? "");

    const { brands } = useBrands();
    const brand = brands.find(b => b.name === decodedBrand);

    // Charger les détails du produit via le hook
    const { product, colorVariants, sizeVariants, loading, error } = useProductDetail(id);

    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | undefined>();

    useEffect(() => {
        if (sizeVariants.length > 0) {
            setSelectedSize(sizeVariants[0]);
        }
    }, [sizeVariants]);

    const handleAddToCart = async () => {
        try {
            if (!user?.id) throw new Error("Non authentifié");
            if (!selectedSize) throw new Error("Sélectionnez une taille");

            console.log("🔍 selectedSize:", selectedSize);
            console.log("🔍 selectedSize.id:", selectedSize.id);

            await addVariantToCart(user.id, selectedSize.id, quantity);  // ❌ 1er toast ici
            setIsCartModalOpen(false);
            setQuantity(1);

            toast.success("Produit ajouté au panier !", {  // ❌ 2ème toast ici
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
            <BannerBrand name={decodedBrand} bannerUrl={brand?.bannerUrl} />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* IMAGES */}
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
                            isAvailable={
                                selectedSize?.isAvailable === true &&
                                selectedSize.stockCount > 0
                            }
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

            <AuthPanel />
            <NavBar />
        </div>
    );
}

