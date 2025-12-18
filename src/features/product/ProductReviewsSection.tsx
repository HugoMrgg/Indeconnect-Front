import { useEffect, useState, useMemo } from "react";
import { Star, MessageSquarePlus, Trash2 } from "lucide-react";
import { fetchProductReviews, disableProductReview } from "@/api/services/products";
import { ProductReview } from "@/types/Product";
import { ReviewModal } from "./ReviewModal";
import { useAuth } from "@/hooks/Auth/useAuth";
import toast from "react-hot-toast";

interface Props {
    productId: number;
    canReview?: boolean; // Booléen : true si le client a acheté le produit
}

export function ProductReviewsSection({ productId, canReview = false }: Props) {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useAuth();
    const canModerate = user?.role === "Vendor";

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetchProductReviews(productId);
                setReviews(res.reviews || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [productId]);

    // Desactivation des reviews
    const handleDisableReview = async (reviewId: number) => {
        if (!confirm("Voulez-vous vraiment masquer cet avis ?")) return;

        try {
            await disableProductReview(reviewId);
            toast.success("Avis désactivé avec succès");

            // On met à jour la liste localement en supprimant l'avis masqué
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        } catch (error) {
            console.error(error);
            toast.error("Impossible de désactiver cet avis.");
        }
    };

    // Moyenne de avis
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    return (
        <div className="mt-16 border-t pt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        Avis Clients
                        {reviews.length > 0 && (
                            <span className="text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                ★ {averageRating} / 5
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {reviews.length} commentaire{reviews.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Bouton "Écrire un avis" (Visible si on a acheté et pas encore noté) */}
                {canReview && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <MessageSquarePlus size={18} />
                        Écrire un avis
                    </button>
                )}
            </div>

            {/* Liste des avis */}
            <div className="space-y-6">
                {loading ? (
                    <p className="text-gray-400 py-4">Chargement...</p>
                ) : reviews.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                        <p className="text-gray-500">Aucun avis pour le moment.</p>
                    </div>
                ) : (
                    reviews.map((r) => (
                        <div key={r.id} className="border-b border-gray-100 pb-6 last:border-0 group relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-medium">
                                        {r.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{r.userName}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={14} className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"} />
                                        ))}
                                    </div>

                                    {/* 4. Bouton de modération (Visible uniquement si autorisé) */}
                                    {canModerate && (
                                        <button
                                            onClick={() => handleDisableReview(r.id)}
                                            title="Désactiver cet avis (Modérateur)"
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2 pl-[52px]">{r.comment}</p>
                        </div>
                    ))
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productId={productId}
                onReviewSuccess={(newReview) => {
                    setReviews([newReview, ...reviews]);
                }}
            />
        </div>
    );
}