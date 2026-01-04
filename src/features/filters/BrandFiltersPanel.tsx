import { X, MapPin, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StarRating } from "@/features/filters/StarRating";
import { belgianCities } from "@/types/belgianCities";
import { useEthicTags } from "@/hooks/Brand/useEthicTags";

interface BrandFiltersPanelProps {
    open: boolean;
    onClose: () => void;
    onReset: () => void;
    resetKey: number;
    sortBy: string;
    onChangeSort: (value: string) => void;
    distance: number | undefined;
    onChangeDistance: (value: number | undefined) => void;
    minRating: number | undefined;
    onChangeRating: (value: number | undefined) => void;
    priceRange: string;
    onChangePriceRange: (value: string) => void;
    minEthicsProduction?: number | undefined;
    onChangeEthicsProduction?: (value: number | undefined) => void;
    minEthicsTransport?: number | undefined;
    onChangeEthicsTransport?: (value: number | undefined) => void;
    selectedCity?: string;
    onChangeCity?: (cityName: string) => void;
    selectedEthicTags?: string[];
    onChangeEthicTags?: (tags: string[]) => void;
    locationMode?: "city" | "gps";
    onChangeLocationMode?: (mode: "city" | "gps") => void;
    onRequestGPS?: () => void;
    gpsLoading?: boolean;
    gpsError?: string | null;
    hasGPSPosition?: boolean;
}

export const BrandFiltersPanel: React.FC<BrandFiltersPanelProps> = ({
                                                                        open,
                                                                        onClose,
                                                                        onReset,
                                                                        resetKey,
                                                                        sortBy,
                                                                        onChangeSort,
                                                                        distance,
                                                                        onChangeDistance,
                                                                        minRating,
                                                                        onChangeRating,
                                                                        priceRange,
                                                                        onChangePriceRange,
                                                                        minEthicsProduction,
                                                                        onChangeEthicsProduction,
                                                                        minEthicsTransport,
                                                                        onChangeEthicsTransport,
                                                                        selectedCity,
                                                                        onChangeCity,
                                                                        selectedEthicTags = [],
                                                                        onChangeEthicTags,
                                                                        locationMode = "city",
                                                                        onChangeLocationMode,
                                                                        onRequestGPS,
                                                                        gpsLoading = false,
                                                                        gpsError = null,
                                                                        hasGPSPosition = false,
                                                                    }) => {

    const { t } = useTranslation();
    const { tags, loading, error } = useEthicTags();

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`
                    fixed z-50 bg-white shadow-2xl rounded-3xl
                    w-[360px] max-w-[90vw]
                    max-h-[85vh]
                    left-[20px] top-1/2 -translate-y-1/2
                    transition-transform duration-300
                    flex flex-col
                    ${open ? "translate-x-0" : "-translate-x-[120%]"}
                `}
                style={{ pointerEvents: open ? "auto" : "none" }}
            >
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                    <h2 className="font-semibold text-lg">
                        {t('filters.title')}
                    </h2>                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5 space-y-6" key={resetKey}>
                    {onChangeCity && onChangeLocationMode && onRequestGPS && (
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <label className="font-semibold mb-3 block text-gray-800 text-sm">
                                {t('filters.location.label')}
                            </label>

                            {/* Toggle City vs GPS */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => onChangeLocationMode("city")}
                                    className={`
                    flex-1 px-4 py-2.5 rounded-xl border transition-all font-medium text-sm
                    ${locationMode === "city"
                                        ? 'border-gray-400 bg-white text-gray-800 shadow-sm'
                                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-white hover:border-gray-300'
                                    }
                `}
                                >
                                    {t('filters.location.city_mode')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChangeLocationMode("gps")}
                                    className={`
                    flex-1 px-4 py-2.5 rounded-xl border transition-all font-medium text-sm
                    ${locationMode === "gps"
                                        ? 'border-gray-400 bg-white text-gray-800 shadow-sm'
                                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-white hover:border-gray-300'
                                    }
                `}
                                >
                                    {t('filters.location.gps_mode')}
                                </button>
                            </div>

                            {locationMode === "city" && (
                                <div>
                                    <select
                                        value={selectedCity ?? ""}
                                        onChange={e => onChangeCity(e.target.value)}
                                        className="rounded-xl border border-gray-300 px-3 py-2.5 w-full text-sm bg-white focus:outline-none focus:border-gray-400 transition"
                                    >
                                        <option value="">{t('filters.location.choose_city')}</option>
                                        {belgianCities.map(city => (
                                            <option key={city.name} value={city.name}>
                                                {city.name} {city.province ? `(${city.province})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedCity && (
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {t('filters.location.simulated_position')} {selectedCity}
                                        </p>
                                    )}
                                </div>
                            )}

                            {locationMode === "gps" && (
                                <div className="space-y-2">
                                    {!hasGPSPosition && (
                                        <button
                                            onClick={onRequestGPS}
                                            disabled={gpsLoading}
                                            className="w-full py-2.5 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {gpsLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    {t('filters.location.gps_loading')}                                                </>
                                            ) : (
                                                <>
                                                    <Navigation className="w-4 h-4" />
                                                    {t('filters.location.activate_gps')}                                                </>
                                            )}
                                        </button>
                                    )}

                                    {hasGPSPosition && (
                                        <div className="bg-white border border-gray-300 px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 text-gray-700">
                                            <Navigation className="w-4 h-4 text-gray-600" />
                                            <span className="font-medium">{t('filters.location.gps_help')}</span>
                                            <span className="ml-auto text-xl">✓</span>
                                        </div>
                                    )}

                                    {gpsError && (
                                        <div className="bg-gray-100 border border-gray-300 px-3 py-2.5 rounded-xl text-xs text-gray-600">
                                            {gpsError}
                                        </div>
                                    )}

                                    {!hasGPSPosition && !gpsError && (
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {t('filters.location.gps_help')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="font-medium mb-2 block">{t('filters.sort.label')}</label>
                        <select
                            value={sortBy}
                            onChange={e => onChangeSort(e.target.value)}
                            className="rounded-lg border px-3 py-2 w-full"
                        >
                            <option value="">{t('filters.sort.none')}</option>
                            <option value="MaterialsManufacturing">{t('filters.sort.ethics_production')}</option>
                            <option value="Transport">{t('filters.sort.ethics_transport')}</option>
                            <option value="Note">{t('filters.sort.rating')}</option>
                            <option value="Distance">{t('filters.sort.distance')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-medium mb-2 block">
                            {t('filters.distance.label')} {distance ?? t('filters.distance.no_limit')} {t('filters.distance.unit')}
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={200}
                            step={1}
                            value={distance ?? 100}
                            onChange={e => onChangeDistance(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 km</span>
                            <span>200 km</span>
                        </div>
                    </div>

                    {onChangeEthicsProduction && (
                        <div>
                            <label className="font-medium mb-2 block">
                                {t('filters.ethics_production.label')} {minEthicsProduction ?? t('filters.ethics_production.none')}/5
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={5}
                                step={0.5}
                                value={minEthicsProduction ?? 0}
                                onChange={e => onChangeEthicsProduction(Number(e.target.value) || undefined)}
                                className="w-full accent-green-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0</span>
                                <span>5</span>
                            </div>
                        </div>
                    )}

                    {onChangeEthicsTransport && (
                        <div>
                            <label className="font-medium mb-2 block">
                                {t('filters.ethics_transport.label')} {minEthicsTransport ?? t('filters.ethics_transport.none')}/5
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={5}
                                step={0.5}
                                value={minEthicsTransport ?? 0}
                                onChange={e => onChangeEthicsTransport(Number(e.target.value) || undefined)}
                                className="w-full accent-green-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0</span>
                                <span>5</span>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="font-medium mb-2 block">
                            {t('filters.rating.label')}
                        </label>
                        <StarRating
                            rating={minRating ?? 0}
                            onRatingChange={(rating) => onChangeRating(rating > 0 ? rating : undefined)}
                        />
                    </div>

                    <div>
                        <label className="font-medium mb-2 block">
                            {t('filters.price_range.label')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "", label: "Tous" },
                                { value: "€", label: "€" },
                                { value: "€€", label: "€€" },
                                { value: "€€€", label: "€€€" }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onChangePriceRange(option.value)}
                                    className={`
                                        px-5 py-2.5 rounded-xl border-2 transition-all font-medium
                                        ${priceRange === option.value
                                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                                    }
                                    `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {onChangeEthicTags && (
                        <div>
                            <label className="font-medium mb-2 block">
                                {t('filters.ethical_tags.label')}
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                {t('filters.ethical_tags.all_required')}
                            </p>

                            {loading && (
                                <p className="text-sm text-gray-400">
                                    {t('filters.ethical_tags.loading')}
                                </p>
                            )}

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            {!loading && !error && (
                                <div className="space-y-2">
                                    {tags.map(tag => (
                                        <label
                                            key={tag.key}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedEthicTags.includes(tag.key)}
                                                onChange={(e) => {
                                                    const newTags = e.target.checked
                                                        ? [...selectedEthicTags, tag.key]
                                                        : selectedEthicTags.filter(t => t !== tag.key);
                                                    onChangeEthicTags(newTags);
                                                }}
                                                className="w-4 h-4 accent-green-500"
                                            />
                                            <span className="flex-1 text-sm">{tag.label}</span>
                                            <span className="text-xs text-gray-500">({tag.brandCount})</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t p-4 bg-white rounded-b-3xl flex-shrink-0">
                    <button onClick={onReset} className="...">
                        {t('filters.reset')}
                    </button>
                </div>
            </div>
        </>
    );
};
