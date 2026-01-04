import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function OrderDetailsSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Breadcrumb skeleton */}
            <div className="mb-6">
                <Skeleton width={300} height={16} />
            </div>

            {/* Header skeleton */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <Skeleton width={200} height={32} className="mb-2" />
                        <div className="flex flex-wrap items-center gap-4">
                            <Skeleton width={150} height={20} />
                            <Skeleton width={100} height={20} />
                            <Skeleton width={120} height={32} borderRadius={20} />
                        </div>
                    </div>
                    <Skeleton width={100} height={40} borderRadius={8} />
                </div>
            </div>

            {/* Brand tabs skeleton */}
            <div className="bg-gradient-to-b from-gray-50 to-white py-4 mb-6">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="bg-gray-100 rounded-2xl p-1.5">
                        <div className="flex gap-1.5">
                            <Skeleton width={120} height={48} borderRadius={12} />
                            <Skeleton width={120} height={48} borderRadius={12} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery card skeleton */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                    <Skeleton width={200} height={24} className="mb-2" />
                    <Skeleton width={150} height={20} />
                </div>

                {/* Timeline skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton circle width={40} height={40} />
                            <div className="flex-1">
                                <Skeleton width="60%" height={20} className="mb-2" />
                                <Skeleton width="40%" height={16} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Products skeleton */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <Skeleton width={150} height={24} className="mb-4" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton width={80} height={80} borderRadius={8} />
                                <div className="flex-1">
                                    <Skeleton width="70%" height={20} className="mb-2" />
                                    <Skeleton width="40%" height={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function OrderDetailsSkeletonList({ count = 1 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <OrderDetailsSkeleton key={i} />
            ))}
        </>
    );
}
