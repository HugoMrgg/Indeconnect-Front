import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { createProductReview } from "@/api/services/products";
import { ProductReview } from "@/types/Product";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    onReviewSuccess: (newReview: ProductReview) => void; // Pour mettre à jour la liste parent
};

export function ReviewModal({ isOpen, onClose, productId, onReviewSuccess }: Props) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const newReview = await createProductReview(productId, {
                rating,
                comment
            });

            toast.success("Votre avis a été publié !");
            onReviewSuccess(newReview); // On envoie le nouvel avis au parent

            // Reset et fermeture
            setComment("");
            setRating(5);
            onClose();
        } catch (_error) {
            toast.error("Erreur lors de l'envoi de l'avis.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-lg">Noter ce produit</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Étoiles */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-500">Quelle note donnez-vous ?</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        className={`${
                                            star <= rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-100 text-gray-200"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Commentaire */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Votre commentaire
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none min-h-[120px] resize-none"
                            placeholder="Dites-nous ce que vous en pensez..."
                            required
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !comment.trim()}
                            className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : "Envoyer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}