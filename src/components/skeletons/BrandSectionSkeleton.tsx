import Skeleton from "react-loading-skeleton";
import {BrandCardSkeleton} from "@/components/skeletons/BrandCardSkeleton";

export function BrandSectionSkeleton({ cards = 4 }: { cards?: number }) {
    return (
        <section className="my-10 px-6">
            {/* Header skeleton */}
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <Skeleton width={220} height={22} />
                    <div className="mt-2">
                        <Skeleton width={90} height={14} />
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    <Skeleton circle width={36} height={36} />
                    <Skeleton circle width={36} height={36} />
                </div>
            </div>

            {/* Scroller skeleton */}
            <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />

                <div className="flex gap-4 overflow-x-hidden pb-3 pt-2">
                    {Array.from({ length: cards }).map((_, i) => (
                        <BrandCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
