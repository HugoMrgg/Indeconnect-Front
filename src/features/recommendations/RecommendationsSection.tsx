import React, { useEffect, useState } from "react";
import { fetchSimilarProducts, type RecommendedProduct } from "@/api/services/recommendations";
import { RecommendedProductCard } from "./RecommendedProductCard";
import { useAuth } from "@/hooks/Auth/useAuth";
import Skeleton from "react-loading-skeleton";
import {RecommendationsSkeletonGrid} from "@/components/skeletons/RecommendedProductCardSkeleton";
import { logger } from "@/utils/logger";

export function RecommendationsSection() {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        async function loadRecommendations() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchSimilarProducts(user.id, 10);

                const arePopularProducts = data.every(
                    p => p.recommendationScore === 0 && p.recommendationReason === "Produit populaire"
                );

                setRecommendations(data);
                setIsPersonalized(!arePopularProducts);
            } catch (e) {
                logger.error("RecommendationsSection.loadRecommendations", e);
                setError(e instanceof Error ? e.message : "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        }

        void loadRecommendations();
    }, [user?.id]);

    if (!user) return null;

    if (loading) {
        return (
            <section className="my-10 px-6">
                <div className="mb-4">
                    <Skeleton width={200} height={20} />
                    <div className="mt-2">
                        <Skeleton width={160} height={14} />
                    </div>
                </div>

                <RecommendationsSkeletonGrid count={5} />
            </section>
        );
    }


    if (error) return null;

    if (recommendations.length === 0) return null;

    return (
        <section className="my-10 px-6">
            <div className="mb-4">
                {isPersonalized ? (
                    <>
                        <h2 className="text-xl font-semibold tracking-tight">Recommandé pour vous</h2>
                        <p className="text-sm text-gray-500">
                            Basé sur vos achats précédents
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold tracking-tight">Produits populaires</h2>
                        <p className="text-sm text-gray-500">
                            Les plus appréciés par la communauté
                        </p>
                    </>
                )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {recommendations.map((product) => (
                    <RecommendedProductCard
                        key={`recommendation-${product.id}`}
                        product={product}
                        showReason={isPersonalized}
                    />
                ))}
            </div>
        </section>
    );
}