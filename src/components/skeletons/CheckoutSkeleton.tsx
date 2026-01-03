import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function CheckoutSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <Skeleton width={300} height={36} className="mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Adresse de livraison */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <Skeleton width={200} height={24} className="mb-4" />
                            <div className="space-y-3">
                                <Skeleton height={120} borderRadius={8} />
                                <Skeleton height={120} borderRadius={8} />
                            </div>
                        </div>

                        {/* Méthodes de livraison */}
                        <div className="space-y-4">
                            <Skeleton width={200} height={24} className="mb-4" />
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                                    <Skeleton width={150} height={20} className="mb-4" />
                                    <div className="space-y-3">
                                        <Skeleton height={60} borderRadius={8} />
                                        <Skeleton height={60} borderRadius={8} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colonne récapitulatif */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <Skeleton width={150} height={24} className="mb-4" />
                            <div className="space-y-3 mb-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton width={120} height={20} />
                                        <Skeleton width={60} height={20} />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between">
                                    <Skeleton width={100} height={24} />
                                    <Skeleton width={80} height={24} />
                                </div>
                            </div>
                            <Skeleton height={48} borderRadius={8} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
