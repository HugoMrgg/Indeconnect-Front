import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <Skeleton height={240} className="rounded-t-3xl" />
            <div className="p-4 space-y-3">
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={16} />
                <div className="flex justify-between items-center mt-4">
                    <Skeleton width={80} height={24} />
                    <Skeleton circle width={40} height={40} />
                </div>
            </div>
        </div>
    );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
