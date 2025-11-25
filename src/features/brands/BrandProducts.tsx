import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";

interface ProductFiltersState {
    filtered: Product[];
    sort: "featured" | "price_asc" | "price_desc";
    setSort: (v: "featured" | "price_asc" | "price_desc") => void;
    view: "grid" | "list";
    setView: (v: "grid" | "list") => void;
}

interface Props {
    filter: ProductFiltersState;
}

import {WishlistService} from "@/api/services/wishlist";
import {userStorage} from "@/context/UserStorage";
import {Product} from "@/types/Product";
import SortBar from "@/features/sorting/SortBar";
import {ProductGrid} from "@/features/brands/ProductGrid";
import {ProductList} from "@/features/brands/ProductList";

export const BrandProducts: React.FC<Props> = ({ filter }) => {
    const { filtered, sort, setSort, view, setView } = filter;

    const user = userStorage.getUser();

    const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
    // Charger les like pour chaque item
    useEffect(() => {
        if (!user?.id) return;
        async function load() {
            const map: Record<number, boolean> = {};

            await Promise.all(
                filtered.map(async (p) => {
                    const res = await WishlistService.isInWishlist(user?.id, p.id);
                    map[p.id] = res.data === true;
                })
            );

            setLikedMap(map);
        }
        void load();
    }, [filtered, user?.id]);

    /** Action centralisée */
    const toggleLike = async (productId: number) => {
        if (!user?.id) return;

        const current = likedMap[productId] ?? false;
        setLikedMap((prev) => ({ ...prev, [productId]: !current }));

        try {
            if (!current) {
                await WishlistService.addToWishlist(user.id, productId);
                toast.success("Produit ajouté à vos favoris ❤️", {
                    icon: "❤️",
                    style: {
                        borderRadius: "10px",
                        background: "#000",
                        color: "#fff",
                    },
                } );
            } else {
                await WishlistService.removeFromWishlist(user.id, productId);
                toast.success("Produit supprimé de vos favoris 💔", {
                    icon: "💔",
                    style: {
                        borderRadius: "10px",
                        background: "#000",
                        color: "#fff",
                    },
                });
            }
        } catch (e) {
            console.error("Erreur wishlist :", e);
            setLikedMap((prev) => ({ ...prev, [productId]: current }));
        }
    };
    return (
        <section className="space-y-4">
            <SortBar
                count={filtered.length}
                sort={sort}
                setSort={setSort}
                view={view}
                setView={setView}
            />

            {view === "grid" ? (
                <ProductGrid items={filtered}
                             likedMap={likedMap}
                             toggleLike={toggleLike}/>
            ) : (
                <ProductList items={filtered}
                             likedMap={likedMap}
                             toggleLike={toggleLike}/>
            )}
        </section>
    );
};
