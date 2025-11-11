// src/pages/products/ProductPage.tsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { BannerBrand } from "@/features/banners/BannerBrand";
import { NavBar } from "@/features/navbar/NavBar";
import { BackLink } from "@/components/ui/BackLink";

export const ProductPage: React.FC = () => {
    const { brandName, productId } = useParams();
    const decodedBrand = decodeURIComponent(brandName ?? "");
    const { products, loading, error } = useProducts(decodedBrand);

    const product = useMemo(
        () => products.find(p => String(p.id) === String(productId)),
        [products, productId]
    );

    if (loading) return (
        <div className="min-h-screen bg-white">
            <BannerBrand name={decodedBrand} />
            <main className="mx-auto max-w-4xl px-4 py-8">Chargement…</main>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-white">
            <BannerBrand name={decodedBrand} />
            <main className="mx-auto max-w-4xl px-4 py-8">
                <p className="text-red-600">Produit introuvable.</p>
                <Link to={`/brand/${encodeURIComponent(decodedBrand)}`} className="underline">
                    Revenir à la marque
                </Link>
            </main>
        </div>
    );

    return (
        <div className="min-h-full bg-white">
            <BannerBrand name={decodedBrand} />

            <main className="mx-auto max-w-5xl px-4 pb-24">
                <div className="py-4">
                    <BackLink />
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="rounded-2xl border p-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[360px] object-cover rounded-xl"
                        />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
                        <div className="mt-1 text-gray-600">par {decodedBrand}</div>

                        <div className="mt-4 text-2xl font-semibold">€ {product.price.toFixed(2)}</div>

                        {product.sizes?.length ? (
                            <div className="mt-5">
                                <p className="text-sm text-gray-600 mb-2">Tailles</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(s => (
                                        <span key={s} className="px-3 py-1 rounded-lg border text-sm">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {product.tags?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {product.tags.map(t => (
                                    <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs">{t}</span>
                                ))}
                            </div>
                        ) : null}

                        <div className="mt-auto pt-8 flex gap-3">
                            <button className="flex-1 rounded-xl bg-black text-white py-2 hover:opacity-90">
                                Ajouter au panier
                            </button>
                            <Link
                                to={`/brand/${encodeURIComponent(decodedBrand)}`}
                                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                            >
                                Voir la marque
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <NavBar />
        </div>
    );
};
