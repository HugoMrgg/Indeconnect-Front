import React, { useEffect, useState } from "react";
import { fetchProductReviews } from "@/api/services/products";
import { ProductReview } from "@/types/Product";

interface Props {
    productId: number;
}

export function ProductReviewsSection({ productId }: Props) {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchProductReviews(productId);
                setReviews(res.reviews || []);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Erreur lors du chargement des avis";
                setError(errorMessage);
                console.error("Error loading reviews:", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [productId]);

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-3">Avis clients</h2>

            {loading && <div>Chargement des avis...</div>}

            {error && !loading && (
                <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {!error && reviews.length === 0 && !loading && (
                <div className="text-gray-500">Pas encore d'avis.</div>
            )}

            {!error && reviews.map(r => (
                <div key={r.id} className="border-b py-4">
                    <div className="font-semibold">{r.userName}</div>
                    <div className="text-yellow-500">{"★".repeat(r.rating)}</div>
                    <p className="text-gray-700 text-sm">{r.comment}</p>
                </div>
            ))}
        </div>
    );
}
