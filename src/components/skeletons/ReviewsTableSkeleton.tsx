import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function ReviewsTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Skeleton width={60} height={24} />
                                <Skeleton width={80} height={24} borderRadius={20} />
                                <Skeleton width={100} height={20} />
                                <Skeleton width={120} height={20} />
                            </div>
                            <Skeleton count={2} height={16} className="mb-2" />
                            <Skeleton width={200} height={14} />
                        </div>
                        <div className="md:ml-4">
                            <Skeleton width={120} height={40} borderRadius={12} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
