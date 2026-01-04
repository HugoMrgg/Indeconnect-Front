import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function SortBarSkeleton() {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <Skeleton width={100} height={20} />
            <div className="flex gap-3">
                <Skeleton width={120} height={36} borderRadius={8} />
                <Skeleton width={80} height={36} borderRadius={8} />
            </div>
        </div>
    );
}
