import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandCard } from "./BrandCard";
import { Brand } from "@/types/brand";

interface BrandSectionProps {
    title: string;
    brands: Brand[];
}

export const BrandSection: React.FC<BrandSectionProps> = ({ title, brands }) => {
    const { t } = useTranslation();
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const countLabel = useMemo(() => {
        const n = brands?.length ?? 0;
        return n <= 1
            ? t('brands.section.result_count_singular', { count: n })
            : t('brands.section.result_count_plural', { count: n });
    }, [brands, t]);

    const scrollByAmount = (dir: "left" | "right") => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = Math.round(el.clientWidth * 0.9);
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section className="my-10 px-6">
            {/* Header */}
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                    <p className="text-sm text-gray-500">{countLabel}</p>
                </div>

                {/* Desktop controls */}
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => scrollByAmount("left")}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border bg-white shadow-sm hover:shadow transition"
                        aria-label={t('brands.section.scroll_left')}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByAmount("right")}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border bg-white shadow-sm hover:shadow transition"
                        aria-label={t('brands.section.scroll_right')}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {(!brands || brands.length === 0) && (
                <div className="rounded-3xl border border-dashed p-10 text-center bg-gray-50">
                    <p className="text-gray-700 font-medium">
                        {t('brands.section.no_match')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('brands.section.try_modify_filters')}
                    </p>
                </div>
            )}

            {/* Scroller */}
            {brands?.length > 0 && (
                <div className="relative">
                    {/* fade edges */}
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />

                    <div
                        ref={scrollerRef}
                        className="flex gap-4 overflow-x-auto pb-3 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin-horizontal"
                    >
                        {brands.map((b, i) => (
                            <div key={`${b.name}-${i}`} className="snap-start">
                                <BrandCard {...b} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};