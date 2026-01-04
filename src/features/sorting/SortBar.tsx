import React from "react";
import { useTranslation } from "react-i18next";

type SortOption = "featured" | "price_asc" | "price_desc";
type ViewMode = "grid" | "list";

interface SortBarProps {
    count: number;
    sort: SortOption;
    setSort: (sort: SortOption) => void;
    view: ViewMode;
    setView: (view: ViewMode) => void;
}

export const SortBar: React.FC<SortBarProps> = ({
                                                    count,
                                                    sort,
                                                    setSort,
                                                    view,
                                                    setView,
                                                }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
                {t(count === 1 ? 'sorting.products_count_singular' : 'sorting.products_count', { count })}
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="rounded-lg border px-3 py-2 text-sm"
                >
                    <option value="featured">{t('sorting.featured')}</option>
                    <option value="price_asc">{t('sorting.price_asc')}</option>
                    <option value="price_desc">{t('sorting.price_desc')}</option>
                </select>

                <div className="hidden sm:flex rounded-lg border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setView("grid")}
                        className={`px-3 py-2 text-sm ${
                            view === "grid" ? "bg-gray-100" : ""
                        }`}
                    >
                        ▦
                    </button>
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        className={`px-3 py-2 text-sm ${
                            view === "list" ? "bg-gray-100" : ""
                        }`}
                    >
                        ≣
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SortBar;
