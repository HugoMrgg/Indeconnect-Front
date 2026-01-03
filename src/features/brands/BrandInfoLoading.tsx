import { NavBar } from "@/features/navbar/NavBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface BrandInfoLoadingProps {
    name: string;
    bannerUrl?: string | null;
}

export const BrandInfoLoading = ({ name, bannerUrl }: BrandInfoLoadingProps) => (
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
            {/* Header card skeleton - Version "info" simplifiée */}
            <section className="relative">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="shrink-0">
                        <Skeleton circle width={80} height={80} />
                    </div>

                    <div className="flex-1">
                        <Skeleton width="40%" height={32} className="mb-2" />
                        <Skeleton width="70%" height={16} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <Skeleton width={80} height={12} className="mb-2" />
                            <Skeleton width={60} height={16} />
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-gray-200" />
                        <div className="hidden sm:block text-right">
                            <Skeleton width={60} height={12} className="mb-2" />
                            <Skeleton width={120} height={16} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Corps de page skeleton */}
            <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Section "À propos" */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <Skeleton width={200} height={24} className="mb-4" />
                        <Skeleton count={4} height={16} className="mb-2" />
                    </div>

                    {/* Section "Où sommes-nous" */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <Skeleton width={180} height={24} className="mb-4" />
                        <Skeleton count={3} height={16} className="mb-2" />
                    </div>

                    {/* Section "Autres informations" */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <Skeleton width={220} height={24} className="mb-4" />
                        <Skeleton count={3} height={16} className="mb-2" />
                    </div>
                </div>

                {/* Colonne droite */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <Skeleton width={160} height={20} className="mb-4" />
                        <div className="space-y-4">
                            <div>
                                <Skeleton width={60} height={14} className="mb-2" />
                                <Skeleton width="90%" height={16} />
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <Skeleton width={100} height={14} className="mb-2" />
                                <Skeleton width={80} height={16} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4">
                        <Skeleton count={2} height={14} />
                    </div>
                </aside>
            </section>
        </main>

        <NavBar />
    </div>
);
