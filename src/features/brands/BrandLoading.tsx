import { NavBar } from "@/features/navbar/NavBar";
import {
    BrandHeaderSkeleton,
    ProductCardSkeletonGrid,
    SortBarSkeleton
} from "@/components/skeletons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface BrandLoadingProps {
    name: string;
    bannerUrl?: string | null;
}

export const BrandLoading = ({ name, bannerUrl }: BrandLoadingProps) => (
    <div className="min-h-full bg-gradient-to-b from-gray-50 to-white">
        {/* Bannière skeleton */}
        <section
            className="relative w-screen h-[20vh] min-h-[100px] md:h-[25vh] overflow-hidden bg-gray-200"
        >
            <Skeleton height="100%" className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton width={200} height={32} />
            </div>
        </section>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 -mt-10 relative">
            <section className="space-y-6">
                {/* Header card skeleton */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-5 sm:px-8 sm:py-6">
                    <BrandHeaderSkeleton />
                </div>

                {/* Products grid skeleton */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <SortBarSkeleton />
                    <div className="mt-6">
                        <ProductCardSkeletonGrid count={8} />
                    </div>
                </div>
            </section>
        </main>

        <NavBar />
    </div>
);