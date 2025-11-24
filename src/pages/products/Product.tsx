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
import {BackLink} from "@/components/ui/BackLink";
import {ProductLoading} from "@/features/product/ProductLoading";

export function ProductPage() {
    const { productId, brandName } = useParams();
    const id = Number(productId);
    const navigate = useNavigate();

    const decodedBrand = decodeURIComponent(brandName ?? "");

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [loading, setLoading] = useState(true);

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
            navigate(`/brand/${encodeURIComponent(decodedBrand)}/product/${variant.productId}`);
        }
    };

    if (loading || !product) return <ProductLoading name={decodedBrand} productName={product?.name} />;

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
                            {product.salePrice
                                ? <>
                                    <span className="text-red-600">{product.salePrice} €</span>
                                    <span className="line-through ml-2 text-gray-500">{product.price} €</span>
                                </>
                                : `${product.price} €`}
                        </p>

                        {/* COULEURS */}
                        <ProductColorSelector
                            current={product.primaryColor}
                            variants={colorVariants}
                            onSelect={handleSelectColor}
                        />

                        {/* TAILLES */}
                        <ProductSizeSelector variants={sizeVariants} />

                        {/* BOUTON PANIER */}
                        <button
                            className="mt-6 bg-black text-white px-5 py-3 rounded-xl w-full text-lg"
                            disabled={!product.isAvailable}
                        >
                            {product.isAvailable ? "Ajouter au panier" : "Indisponible"}
                        </button>

                        {/* DESCRIPTION */}
                        <div className="mt-10 text-gray-700">
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p>{product.description}</p>
                        </div>
                        <div className="mt-10 text-gray-700">
                            <BackLink/>
                        </div>
                    </div>

                    <NavBar />
                </div>

                {/* AVIS */}
                <ProductReviewsSection productId={id} />
            </div>
        </div>
    );
}
