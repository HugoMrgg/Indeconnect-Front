import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function ProductDetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Galerie d'images - Colonne gauche */}
                <div className="flex gap-4">
                    {/* Miniatures VERTICALES à gauche */}
                    <div className="flex flex-col gap-3">
                        <Skeleton width={80} height={80} className="rounded-lg" />
                        <Skeleton width={80} height={80} className="rounded-lg" />
                        <Skeleton width={80} height={80} className="rounded-lg" />
                        <Skeleton width={80} height={80} className="rounded-lg" />
                    </div>

                    {/* Image principale à droite */}
                    <div className="flex-1 flex items-center justify-center">
                        <Skeleton height={600} className="rounded-xl" style={{ width: '100%' }} />
                    </div>
                </div>

                {/* Informations produit - Colonne droite */}
                <div>
                    {/* Nom du produit */}
                    <Skeleton width="90%" height={36} />

                    {/* Prix */}
                    <div className="mt-2">
                        <Skeleton width={120} height={32} />
                    </div>

                    {/* Couleur */}
                    <div className="mt-6">
                        <Skeleton width={80} height={20} className="mb-2" />
                        <div className="grid grid-cols-6 gap-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={`color-${i}`} className="flex flex-col items-center gap-1">
                                    <Skeleton circle width={32} height={32} />
                                    <Skeleton width={48} height={11} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Taille */}
                    <div className="mt-6">
                        <Skeleton width={60} height={20} className="mb-2" />
                        <div className="grid grid-cols-4 gap-3">
                            <Skeleton height={40} borderRadius={8} />
                            <Skeleton height={40} borderRadius={8} />
                            <Skeleton height={40} borderRadius={8} />
                            <Skeleton height={40} borderRadius={8} />
                        </div>
                    </div>

                    {/* Bouton Ajouter au panier */}
                    <div className="mt-6">
                        <Skeleton height={48} borderRadius={12} />
                    </div>

                    {/* Description */}
                    <div className="mt-10 text-gray-700">
                        <Skeleton width={150} height={24} className="mb-3" />
                        <Skeleton count={3} height={16} className="mb-1" />
                    </div>

                    {/* BackLink */}
                    <div className="mt-10">
                        <Skeleton width={100} height={20} />
                    </div>
                </div>
            </div>

            {/* Section Fréquemment achetés ensemble */}
            <div className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton width={24} height={24} />
                    <Skeleton width="40%" height={24} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={`freq-skeleton-${i}`} className="space-y-2">
                            <Skeleton height={200} className="rounded-lg" />
                            <Skeleton height={16} />
                            <Skeleton width="60%" height={14} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Avis */}
            <div className="mt-12">
                <Skeleton width="30%" height={28} className="mb-6" />

                {/* Résumé des avis */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Skeleton width={80} height={60} />
                        <div className="flex-1">
                            <Skeleton width={150} height={24} className="mb-2" />
                            <Skeleton width={200} height={16} />
                        </div>
                    </div>
                </div>

                {/* Liste des avis */}
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={`review-skeleton-${i}`} className="border-b pb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Skeleton circle width={40} height={40} />
                                <div className="flex-1">
                                    <Skeleton width={120} height={16} className="mb-1" />
                                    <Skeleton width={100} height={14} />
                                </div>
                            </div>
                            <Skeleton count={2} height={14} className="mb-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
