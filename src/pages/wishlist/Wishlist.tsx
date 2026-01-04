import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { WishlistPageLayout } from "@/features/wishlist/WishlistPageLayout";
import { WishlistContent } from "@/features/wishlist/WishlistContent";

import { WishlistService } from "@/api/services/wishlist";
import {useWishlist} from "@/hooks/User/useWishList";
import {WishlistResponse} from "@/api/services/wishlist/types";
import {userStorage} from "@/storage/UserStorage";
import {WishlistSkeleton} from "@/components/skeletons";

export function Wishlist() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState<string>("");

    const user = userStorage.getUser();

    if (user === null) {
        toast.error("Connecte-toi pour voir tes favoris ❤️");
        navigate("/");
    }

    const { wishlist, loading, error, retry } = useWishlist(user?.id);

    const [view, setView] = useState<"grid" | "list">("grid");

    const filteredWishlist = useMemo(() => {
        if (!wishlist) return [];

        if (!searchQuery.trim()) return wishlist.items;

        const query = searchQuery.toLowerCase();

        return wishlist.items.filter(item => {
            const matchName = item.productName?.toLowerCase().includes(query);
            const matchDescription = item.description?.toLowerCase().includes(query);
            const matchBrand = item.brandName?.toLowerCase().includes(query);
            return matchName || matchDescription || matchBrand;
        });
    }, [wishlist, searchQuery]);

    const handleRemove = async (productId: number) => {
        await WishlistService.removeFromWishlist(user?.id, productId);
        toast.success("Produit supprimé de vos favoris ❤️", {
            icon: "🗑️",
            style: {
                borderRadius: "10px",
                background: "#000",
                color: "#fff",
            },
        });
        await retry();
    };

    const handleOpenProduct = (brand: string, productId: number) => {
        navigate(`/brand/${encodeURIComponent(brand)}/product/${productId}`);
    };

    if (loading) {
        return (
            <WishlistPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="px-6 mt-6">
                    <WishlistSkeleton />
                </div>
            </WishlistPageLayout>
        );
    }

    if (error) {
        return (
            <WishlistPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <div className="flex justify-center items-center mt-12">
                    <p className="text-red-600">{error}</p>
                </div>
            </WishlistPageLayout>
        );
    }

    return (
        <WishlistPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            <WishlistContent
                wishlist={{
                    ...(wishlist as WishlistResponse),
                    items: filteredWishlist
                }}
                view={view}
                setView={setView}
                handleOpenProduct={handleOpenProduct}
                handleRemove={handleRemove}
            />
        </WishlistPageLayout>
    );
}
