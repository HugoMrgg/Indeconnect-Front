import React from "react";
import { X } from "lucide-react";
import { StarRating } from "@/features/filters/StarRating";
import { belgianCities } from "@/types/belgianCities";
import { useEthicTags } from "@/hooks/useEthicTags";

/**
 * Interface TypeScript qui définit TOUTES les props du composant
 */
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
    selectedEthicTags?: string[]; // ← NOUVEAU
    onChangeEthicTags?: (tags: string[]) => void; // ← NOUVEAU
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
                                                                        onChangeEthicTags
                                                                    }) => {
    /**
     * ===== HOOK POUR RÉCUPÉRER LES TAGS ÉTHIQUES =====
     *
     * Appelle l'API /ethics/tags au montage du composant
     * Retourne :
     * - tags : liste des tags disponibles avec label et nombre de marques
     * - loading : true pendant le chargement
     * - error : message d'erreur si l'appel échoue
     */
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
                    <h2 className="font-semibold text-lg">Filtres</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5 space-y-6" key={resetKey}>
                    {onChangeCity && (
                        <div>
                            <label className="font-medium mb-2 block">Ville de référence :</label>
                            <select
                                value={selectedCity ?? ""}
                                onChange={e => onChangeCity(e.target.value)}
                                className="rounded-lg border px-3 py-2 w-full"
                            >
                                <option value="">Aucune ville</option>
                                {belgianCities.map(city => (
                                    <option key={city.name} value={city.name}>
                                        {city.name} {city.province ? `(${city.province})` : ''}
                                    </option>
                                ))}
                            </select>
                            {selectedCity && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Position simulée à {selectedCity}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="font-medium mb-2 block">Trier par :</label>
                        <select
                            value={sortBy}
                            onChange={e => onChangeSort(e.target.value)}
                            className="rounded-lg border px-3 py-2 w-full"
                        >
                            <option value="">Aucun tri</option>
                            <option value="MaterialsManufacturing">Éthique production</option>
                            <option value="Transport">Éthique transport</option>
                            <option value="Note">Note utilisateur</option>
                            <option value="Distance">Distance</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-medium mb-2 block">
                            Distance max : {distance ?? "Pas de limite"} km
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
                                Éthique production min : {minEthicsProduction ?? "Aucun"}/5
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
                                Éthique transport min : {minEthicsTransport ?? "Aucun"}/5
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
                        <label className="font-medium mb-2 block">Note minimale :</label>
                        <StarRating
                            rating={minRating ?? 0}
                            onRatingChange={(rating) => onChangeRating(rating > 0 ? rating : undefined)}
                        />
                    </div>

                    <div>
                        <label className="font-medium mb-2 block">Gamme de prix :</label>
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

                    {/**
                     * ===== NOUVEAU FILTRE : TAGS ÉTHIQUES =====
                     *
                     * Affiché seulement si onChangeEthicTags existe
                     *
                     * États possibles :
                     * - loading : affiche "Chargement des tags..."
                     * - error : affiche le message d'erreur en rouge
                     * - tags chargés : affiche les checkboxes
                     *
                     * Logique ET :
                     * - Les marques doivent avoir TOUS les tags cochés
                     * - Chaque checkbox ajoute/retire un tag de selectedEthicTags
                     *
                     * UI :
                     * - Label avec le nom du tag
                     * - Compteur du nombre de marques ayant ce tag
                     */}
                    {onChangeEthicTags && (
                        <div>
                            <label className="font-medium mb-2 block">Tags éthiques :</label>
                            <p className="text-xs text-gray-500 mb-3">
                                La marque doit avoir TOUS les tags cochés
                            </p>

                            {loading && (
                                <p className="text-sm text-gray-400">Chargement des tags...</p>
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
                    <button
                        onClick={onReset}
                        className="w-full py-2.5 rounded-xl border text-sm hover:bg-gray-50 transition"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>
        </>
    );
};
