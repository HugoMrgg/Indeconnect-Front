import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function RecommendedProductSkeleton() {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <Skeleton height={240} className="rounded-t-3xl" />
            <div className="p-4 space-y-2">
                <Skeleton width="90%" height={16} />
                <Skeleton width="50%" height={12} />
                <Skeleton width="60%" height={20} className="mt-2" />
                <Skeleton width="70%" height={14} className="mt-2" />
                <Skeleton width="100%" height={24} borderRadius={12} className="mt-2" />
            </div>
        </div>
    );
}

export function RecommendedProductSkeletonGrid({ count = 5 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <RecommendedProductSkeleton key={i} />
            ))}
        </div>
    );
}
