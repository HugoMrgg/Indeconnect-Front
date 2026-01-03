import Skeleton from "react-loading-skeleton";

export function RecommendedProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="p-4">
                <Skeleton height={16} width="90%" />
                <div className="mt-2">
                    <Skeleton height={14} width="60%" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <Skeleton height={18} width={70} />
                    <Skeleton height={14} width={50} />
                </div>

                <div className="mt-3">
                    <Skeleton height={14} width="70%" />
                </div>

                <div className="mt-3">
                    <Skeleton height={22} width="100%" borderRadius={8} />
                </div>
            </div>
        </div>
    );
}

export function RecommendationsSkeletonGrid({ count = 5 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <RecommendedProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
