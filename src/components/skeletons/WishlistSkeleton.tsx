import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function WishlistSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((brandIndex) => (
                <div key={brandIndex} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={150} height={24} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((productIndex) => (
                            <div key={productIndex} className="space-y-2">
                                <Skeleton height={160} className="rounded-lg" />
                                <Skeleton width="90%" height={16} />
                                <Skeleton width="60%" height={20} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
