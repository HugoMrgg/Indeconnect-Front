import React, {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

import { WishlistService } from "@/api/services/wishlist";
import { userStorage } from "@/storage/UserStorage";
import { Product } from "@/types/Product";

import SortBar from "@/features/sorting/SortBar";
import { AddProduct } from "@/features/product/AddProduct";
import { ProductGrid } from "@/features/brands/ProductGrid";
import { ProductList } from "@/features/brands/ProductList";

/* Typage du filtre */
interface ProductFiltersState {
    filtered: Product[];
    sort: "featured" | "price_asc" | "price_desc";
    setSort: (v: "featured" | "price_asc" | "price_desc") => void;
    view: "grid" | "list";
    setView: (v: "grid" | "list") => void;
}

interface Props {
    filter: ProductFiltersState;
    searchQuery: string;
}

export const BrandProducts: React.FC<Props> = ({ filter, searchQuery }) => {
    const { filtered, sort, setSort, view, setView } = filter;

    const user = userStorage.getUser();
    /** Filtrage par texte */
    const filteredByText = useMemo(() => {
        if (!searchQuery.trim()) return filtered;

        const query = searchQuery.toLowerCase();

        return filtered.filter((p) => {
            const matchName = p.name?.toLowerCase().includes(query);
            const matchDescription = p.description?.toLowerCase().includes(query);
            const matchColor = p.primaryColor?.name?.toLowerCase().includes(query);

            return matchName || matchDescription || matchColor;
        });
    }, [filtered, searchQuery]);

    /** Map dynamique des likes */
    const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!user?.id) return;

        async function load() {
            const map: Record<number, boolean> = {};

            await Promise.all(
                filteredByText.map(async (p) => {
                    try {
                        const res = await WishlistService.isInWishlist(user?.id, p.id);
                        map[p.id] = res.data.exists === true;
                    } catch {
                        map[p.id] = false;
                    }
                })
            );

            setLikedMap(map);
        }

        void load();
    }, [filteredByText, user?.id]);

    // 🔥 Gestion centralisée du like / unlike
    const toggleLike = async (productId: number) => {
        if (!user?.id) {
            toast.error("Connecte-toi pour ajouter aux favoris ❤️");
            return;
        }

        const current = likedMap[productId] ?? false;

        // Optimistic update
        setLikedMap((prev) => ({ ...prev, [productId]: !current }));

        try {
            if (!current) {
                await WishlistService.addToWishlist(user.id, productId);
                toast.success("Ajouté à vos favoris ❤️", {
                    style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                });
            } else {
                await WishlistService.removeFromWishlist(user.id, productId);
                toast.success("Retiré de vos favoris 💔", {
                    style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                });
            }
        } catch (err) {
            console.error("Wishlist error", err);
            setLikedMap((prev) => ({ ...prev, [productId]: current }));
        }
    };

    if (filteredByText.length === 0) {
        return (
            <section className="space-y-4 py-10 text-center text-gray-500">
                <AddProduct />

                <p className="text-lg">Votre recherche n’a rien donné...</p>
                <p className="text-sm opacity-70">Essayez d’autres mots-clés</p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <SortBar
                count={filteredByText.length}
                sort={sort}
                setSort={setSort}
                view={view}
                setView={setView}
            />

            {view === "grid" ? (
                <ProductGrid
                    items={filteredByText}
                    likedMap={likedMap}
                    toggleLike={toggleLike}
                />
            ) : (
                <ProductList
                    items={filteredByText}
                    likedMap={likedMap}
                    toggleLike={toggleLike}
                />
            )}
        </section>
    );
};
