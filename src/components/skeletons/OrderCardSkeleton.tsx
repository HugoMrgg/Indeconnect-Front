import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function OrderCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <Skeleton width={150} height={20} className="mb-2" />
                    <Skeleton width={100} height={16} />
                </div>
                <Skeleton width={100} height={28} borderRadius={16} />
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton width={80} height={80} className="rounded-lg" />
                            <div className="flex-1">
                                <Skeleton width="80%" height={18} />
                                <Skeleton width="60%" height={16} className="mt-2" />
                                <Skeleton width={60} height={20} className="mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                <Skeleton width={100} height={24} />
                <Skeleton width={120} height={36} borderRadius={8} />
            </div>
        </div>
    );
}

export function OrderCardSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <OrderCardSkeleton key={i} />
            ))}
        </div>
    );
}
