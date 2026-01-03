import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-100 px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <Skeleton width={300} height={48} className="mb-4" />
                    <Skeleton width={400} height={24} />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <Skeleton count={10} height={20} className="mb-2" />
            </div>
        </div>
    );
}
