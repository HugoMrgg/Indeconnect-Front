import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function BrandCardSkeleton() {
    return (
        <div
            className="min-w-96 max-w-96 min-h-56 p-4 rounded-3xl border border-gray-100 bg-white shadow-sm"
            aria-hidden="true"
        >
            {/* TOP: logo + name + rating + distance */}
            <div className="flex items-start gap-3">
                {/* logo */}
                <div className="h-14 w-14 shrink-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden grid place-items-center">
                    <Skeleton width={56} height={56} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        {/* title */}
                        <Skeleton width="60%" height={20} />

                        {/* distance pill */}
                        <div className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1">
                            <Skeleton width={55} height={12} />
                        </div>
                    </div>

                    {/* rating row */}
                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton width={90} height={16} />
                        <Skeleton width={28} height={16} />
                    </div>
                </div>
            </div>

            {/* ETHICS blocks */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                {[0, 1].map((i) => (
                    <div key={i} className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                        <Skeleton width="70%" height={12} />
                        <div className="mt-2">
                            <Skeleton height={8} />
                        </div>
                        <div className="mt-2">
                            <Skeleton width={50} height={16} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="mt-3">
                <Skeleton count={2} height={14} />
            </div>

            {/* Footer chips */}
            <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton width={120} height={22} borderRadius={999} />
                <Skeleton width={90} height={22} borderRadius={999} />
            </div>
        </div>
    );
}