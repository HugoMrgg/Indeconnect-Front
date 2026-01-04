import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EthicsCategoryDto, EthicsQuestionDto, EthicsOptionDto } from "@/api/services/ethics/superVendor/types";
import { EthicsQuestionCard } from "@/features/admin/ethics/components/EthicsQuestionCard";

type Props = {
    category: EthicsCategoryDto | null;
    readOnly: boolean;
    searchQuery: string;

    onUpdateCategory: (categoryId: number, patch: Partial<EthicsCategoryDto>) => void;
    onDeleteCategory: (categoryId: number) => void;

    onAddQuestion: (categoryId: number) => void;
    onUpdateQuestion: (categoryId: number, questionId: number, patch: Partial<EthicsQuestionDto>) => void;
    onDeleteQuestion: (categoryId: number, questionId: number) => void;

    onAddOption: (categoryId: number, questionId: number) => void;
    onUpdateOption: (categoryId: number, questionId: number, optionId: number, patch: Partial<EthicsOptionDto>) => void;
    onDeleteOption: (categoryId: number, questionId: number, optionId: number) => void;
};

export const EthicsCategoryEditor: React.FC<Props> = ({
                                                          category,
                                                          readOnly,
                                                          searchQuery,
                                                          onUpdateCategory,
                                                          onDeleteCategory,
                                                          onAddQuestion,
                                                          onUpdateQuestion,
                                                          onDeleteQuestion,
                                                          onAddOption,
                                                          onUpdateOption,
                                                          onDeleteOption,
                                                      }) => {
    const { t } = useTranslation();

    if (!category) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
                {t('ethics.editor.add_category_prompt')}
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            {/* Catégorie */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">
                                {t('ethics.editor.label')}
                            </label>
                            <input
                                disabled={readOnly}
                                value={category.label}
                                onChange={(e) => onUpdateCategory(category.id, { label: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600">
                                {t('ethics.editor.key')}
                            </label>
                            <input
                                disabled={readOnly}
                                value={category.key}
                                onChange={(e) => onUpdateCategory(category.id, { key: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-600">
                                {t('ethics.editor.order')}
                            </label>
                            <input
                                disabled={readOnly}
                                type="number"
                                value={category.order}
                                onChange={(e) => onUpdateCategory(category.id, { order: Number(e.target.value) })}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-end justify-end">
                            <button
                                type="button"
                                disabled={readOnly}
                                onClick={() => onDeleteCategory(category.id)}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                                {t('ethics.editor.delete_category')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">
                    {t('ethics.editor.questions_title')}
                </div>
                <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => onAddQuestion(category.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <Plus size={16} /> {t('ethics.editor.add_question')}
                </button>
            </div>

            <div className="mt-3 space-y-4">
                {category.questions
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((q) => (
                        <EthicsQuestionCard
                            key={q.id}
                            categoryId={category.id}
                            question={q}
                            readOnly={readOnly}
                            searchQuery={searchQuery}
                            onUpdateQuestion={onUpdateQuestion}
                            onDeleteQuestion={onDeleteQuestion}
                            onAddOption={onAddOption}
                            onUpdateOption={onUpdateOption}
                            onDeleteOption={onDeleteOption}
                        />
                    ))}

                {category.questions.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        {t('ethics.editor.no_questions')}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
