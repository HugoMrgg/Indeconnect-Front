import {WishlistItem, WishlistResponse} from "@/api/services/wishlist/types";
import React from "react";
import {WishlistProductCard} from "@/features/wishlist/WishlistProdcutCard";

export function WishlistContent({
                             wishlist,
                             view,
                             setView,
                             handleOpenProduct,
                             handleRemove
                         }: {
    wishlist: WishlistResponse;
    view: "grid" | "list";
    setView: (v: "grid" | "list") => void;
    handleOpenProduct: (brand: string, productId: number) => void;
    handleRemove: (productId: number) => void;
}) {

    const items = wishlist.items ?? [];

    // Groupement par marque
    const groupedByBrand = items.reduce((acc: Record<string, WishlistItem[]>, item) => {
        acc[item.brandName] = acc[item.brandName] || [];
        acc[item.brandName].push(item);
        return acc;
    }, {});

    const brandNames = Object.keys(groupedByBrand);

    return (
        <div className="min-h-screen bg-white max-w-6xl mx-auto px-5 py-10">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-semibold">Mes Favoris</h1>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex rounded-lg border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setView("grid")}
                            className={`px-3 py-2 text-sm ${
                                view === "grid" ? "bg-gray-100" : ""
                            }`}
                        >
                            ▦
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("list")}
                            className={`px-3 py-2 text-sm ${
                                view === "list" ? "bg-gray-100" : ""
                            }`}
                        >
                            ≣
                        </button>
                    </div>
                </div>
            </div>

    {/* AUCUN FAVORI */}
    {items.length === 0 && (
        <div className="text-gray-500 text-lg text-center py-20">
            Aucun article en favoris.
    </div>
    )}

    {/* LISTE GROUPÉE PAR MARQUE */}
    {brandNames.map((brand) => (
        <div key={brand} className="mb-12">

    <h2 className="text-2xl font-bold mb-5">{brand}</h2>

        {/* --- MODE GRILLE --- */}
        {view === "grid" && (
            <div
                className="grid grid-cols-[repeat(auto-fill,minmax(160px,max-content))] gap-3">
                {groupedByBrand[brand].map((item) => {
                        const product = {
                            id: item.productId,
                            name: item.productName,
                            price: item.price,
                            primaryImageUrl: "../../images/" +  item.primaryImageUrl,
                            primaryColor: item.primaryColor,
                        } as any;

                        return (
                            <WishlistProductCard
                                product={product}
                                onRemove={handleRemove}
                            />
                        );
                    })}
                </div>
            )}

        {/* --- MODE LISTE --- */}
        {view === "list" && (
            <div className="space-y-4">
                {groupedByBrand[brand].map((item) => (
                        <div
                            key={item.productId}
                            className="flex items-center border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => handleOpenProduct(item.brandName, item.productId)}>
                            <img
                                src={"../../images/" + item.primaryImageUrl}
                            alt={item.productName}
                            className="w-24 h-24 rounded-xl object-cover mr-4"
                            />

                            <div className="flex flex-col flex-grow">
                                <p className="text-lg font-semibold">{item.productName}</p>
                                <p className="text-gray-500 text-sm">{item.description}</p>
                                <p className="mt-1 font-bold">{item.price} €</p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(item.productId);
                                }}
                                className="text-red-500 font-semibold ml-5">
                                    Supprimer
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ))}
    </div>
);
}