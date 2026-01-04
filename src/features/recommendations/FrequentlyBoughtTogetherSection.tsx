import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchFrequentlyBoughtTogether, type RecommendedProduct } from "@/api/services/recommendations";
import { RecommendedProductCard } from "./RecommendedProductCard";
import { Package } from "lucide-react";
import { logger } from "@/utils/logger";

interface FrequentlyBoughtTogetherSectionProps {
    productId: number;
}

export function FrequentlyBoughtTogetherSection({
                                                    productId
                                                }: FrequentlyBoughtTogetherSectionProps) {
    const { t } = useTranslation();
    const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadRecommendations() {
            setLoading(true);
            try {
                const data = await fetchFrequentlyBoughtTogether(productId, 5);
                setRecommendations(data);
            } catch (e) {
                logger.error("FrequentlyBoughtTogetherSection.loadRecommendations", e);
            } finally {
                setLoading(false);
            }
        }

        void loadRecommendations();
    }, [productId]);

    if (loading) {
        return (
            <div className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-gray-700" />
                    <h2 className="text-xl font-semibold text-gray-900">
                        {t('product.recommendations.frequently_bought_together')}
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={`skeleton-${i}`} className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                    {t('product.recommendations.frequently_bought_together')}
                </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {recommendations.map((product) => (
                    <RecommendedProductCard
                        key={`frequently-bought-${product.id}`}
                        product={product}
                        showReason={true}
                    />
                ))}
            </div>
        </div>
    );
}
