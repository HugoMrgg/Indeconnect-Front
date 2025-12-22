import React from "react";
import { Plus } from "lucide-react";
import { EthicsCategoryDto } from "@/api/services/ethics/superVendor/types";
import { highlight } from "@/features/admin/ethics/utils/search";

type Props = {
    categories: EthicsCategoryDto[];
    selectedCategoryId: number | null;
    onSelect: (id: number) => void;
    onAdd: () => void;
    readOnly: boolean;
    searchQuery: string;
};

export const EthicsCategoriesSidebar: React.FC<Props> = ({
                                                             categories,
                                                             selectedCategoryId,
                                                             onSelect,
                                                             onAdd,
                                                             readOnly,
                                                             searchQuery,
                                                         }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Catégories</div>
                <button
                    type="button"
                    onClick={onAdd}
                    disabled={readOnly}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <Plus size={16} /> Ajouter
                </button>
            </div>

            <div className="mt-3 space-y-2">
                {categories
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((c) => {
                        const active = selectedCategoryId === c.id;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => onSelect(c.id)}
                                className={`w-full rounded-xl px-3 py-2 text-left text-sm border transition ${
                                    active ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                <div className="font-semibold text-gray-900">
                                    {highlight(c.label, searchQuery)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {highlight(c.key, searchQuery)} • {c.questions.length} questions
                                </div>
                            </button>
                        );
                    })}

                {categories.length === 0 ? (
                    <div className="text-sm text-gray-500 p-3">
                        Aucun résultat. Essaie un autre mot-clé.
                    </div>
                ) : null}
            </div>
        </div>
    );
};
