import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function BrandHeaderSkeleton() {
    return (
        <div className="space-y-6 my-8">
            <div className="flex justify-between gap-6">
                {/* Logo + infos */}
                <div className="flex-1 flex items-start gap-4">
                    <Skeleton circle width={56} height={56} className="shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton width="40%" height={32} />
                        <Skeleton width="80%" height={16} />
                        <Skeleton width="70%" height={16} />
                        <div className="flex gap-2 mt-4">
                            <Skeleton width={120} height={28} borderRadius={14} />
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col gap-3">
                    <Skeleton width={140} height={44} borderRadius={12} />
                    <Skeleton width={140} height={44} borderRadius={12} />
                </div>
            </div>
        </div>
    );
}
