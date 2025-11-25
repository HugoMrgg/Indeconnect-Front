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

export function ProductPage() {
    const { productId, brandName } = useParams();
    const id = Number(productId);
    const navigate = useNavigate();

    const decodedBrand = decodeURIComponent(brandName ?? "");

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { user } = useAuth();

    // Taille sélectionnée : ici à adapter si tu utilises un state dédié (sinon prendre la 1ère : sizeVariants[0])
    const [selectedSize, setSelectedSize] = useState<SizeVariant | undefined>();
    useEffect(() => {
        setSelectedSize(sizeVariants.length > 0 ? sizeVariants[0] : undefined);
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

        load();
    }, [id]);

    const handleSelectColor = (variant: ColorVariant) => {
        if (variant.productId !== id) {
            navigate(
                `/brand/${encodeURIComponent(decodedBrand)}/product/${variant.productId}`
            );
        }
    };

    const handleSelectSize = (size: SizeVariant) => {
        setSelectedSize(size);
    };

    if (loading || !product)
        return (
            <ProductLoading name={decodedBrand} productName={product?.name} />
        );

    return (
        <div className="min-h-screen bg-white">
            <BannerBrand name={decodedBrand} />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* IMAGES */}
                    <ProductImageGallery images={product.media} />

                    {/* INFO PRODUIT */}
                    <div>
                        <h1 className="text-3xl font-semibold">{product.name}</h1>
                        <p className="text-2xl mt-2 font-bold">
                            {product.salePrice ? (
                                <>
                                    <span className="text-red-600">{product.salePrice} €</span>
                                    <span className="line-through ml-2 text-gray-500">
                                        {product.price} €
                                    </span>
                                </>
                            ) : (
                                `${product.price} €`
                            )}
                        </p>

                        {/* COULEURS */}
                        <ProductColorSelector
                            current={product.primaryColor}
                            variants={colorVariants}
                            onSelect={handleSelectColor}
                        />

                        {/* TAILLES */}
                        <ProductSizeSelector
                            variants={sizeVariants}
                            selected={selectedSize}
                            onSelect={handleSelectSize}
                        />

                        {/* BOUTON PANIER */}
                        <button
                            className="mt-6 bg-black text-white px-5 py-3 rounded-xl w-full text-lg"
                            disabled={!product.isAvailable}
                            onClick={() => {
                                if (!product.isAvailable) return;
                                setQuantity(1);
                                setIsCartModalOpen(true);
                            }}
                        >
                            {product.isAvailable ? "Ajouter au panier" : "Indisponible"}
                        </button>

                        {/* DESCRIPTION */}
                        <div className="mt-10 text-gray-700">
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p>{product.description}</p>
                        </div>
                        <div className="mt-10 text-gray-700">
                            <BackLink />
                        </div>
                    </div>
                    <NavBar />
                </div>
                {/* AVIS */}
                <ProductReviewsSection productId={id} />
            </div>

            {/* MODALE AJOUT PANIER */}
            {isCartModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Ajouter au panier</h2>
                        <div className="flex gap-4 mb-4">
                            <img
                                src={product.media[0]?.url || "/placeholder.png"}
                                alt={product.name}
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{decodedBrand}</p>
                                <p className="mt-1 font-semibold">
                                    {product.salePrice ?? product.price} €
                                </p>
                                {product.primaryColor && (
                                    <p className="text-xs text-gray-500">
                                        Couleur : {product.primaryColor.name}
                                    </p>
                                )}
                                {selectedSize && (
                                    <p className="text-xs text-gray-500">
                                        Taille : {selectedSize.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm text-gray-600">Quantité</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="min-w-[2rem] text-center font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsCartModalOpen(false)}
                                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        console.log("User courant :", user);
                                        console.log("SelectedSize :", selectedSize);
                                        if (!user?.id) throw new Error("Non authentifié");
                                        if (!selectedSize) throw new Error("Sélectionnez une taille");
                                        console.log("addVariantToCart params:", user?.id, selectedSize?.id, quantity);

                                        await addVariantToCart(user.id, selectedSize.id, quantity);

                                        setIsCartModalOpen(false);
                                    } catch (e: unknown) {
                                        // log complet de l'erreur (type-safe)
                                        if (e instanceof Error) {
                                            console.error("Erreur ajout panier :", e.message, e);
                                            alert(e.message ?? "Erreur ajout panier");
                                        } else {
                                            console.error("Erreur inconnue ajout panier :", e);
                                            alert("Erreur inconnue lors de l'ajout au panier");
                                        }
                                    }
                                }}
                                className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
