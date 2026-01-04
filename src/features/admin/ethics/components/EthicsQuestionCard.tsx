import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { EthicsOptionDto, EthicsQuestionDto } from "@/api/services/ethics/superVendor/types";
import { highlight } from "@/features/admin/ethics/utils/search";
import { useTranslation } from 'react-i18next';

type Props = {
    categoryId: number;
    question: EthicsQuestionDto;
    readOnly: boolean;
    searchQuery: string;

    onUpdateQuestion: (categoryId: number, questionId: number, patch: Partial<EthicsQuestionDto>) => void;
    onDeleteQuestion: (categoryId: number, questionId: number) => void;

    onAddOption: (categoryId: number, questionId: number) => void;
    onUpdateOption: (categoryId: number, questionId: number, optionId: number, patch: Partial<EthicsOptionDto>) => void;
    onDeleteOption: (categoryId: number, questionId: number, optionId: number) => void;
};

export const EthicsQuestionCard: React.FC<Props> = ({
                                                        categoryId,
                                                        question: q,
                                                        readOnly,
                                                        searchQuery,
                                                        onUpdateQuestion,
                                                        onDeleteQuestion,
                                                        onAddOption,
                                                        onUpdateOption,
                                                        onDeleteOption,
                                                    }) => {
    const { t } = useTranslation();
    return (
        <div className="rounded-2xl border border-gray-200 p-4">
            {/* Question */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.questionLabel')}</label>
                    <input
                        disabled={readOnly}
                        value={q.label}
                        onChange={(e) => onUpdateQuestion(categoryId, q.id, { label: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {searchQuery.trim() ? (
                        <div className="mt-1 text-xs text-gray-600">{highlight(q.label, searchQuery)}</div>
                    ) : null}
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.keyLabel')}</label>
                    <input
                        disabled={readOnly}
                        value={q.key}
                        onChange={(e) => onUpdateQuestion(categoryId, q.id, { key: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {searchQuery.trim() ? (
                        <div className="mt-1 text-xs text-gray-600">{highlight(q.key, searchQuery)}</div>
                    ) : null}
                </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.answerTypeLabel')}</label>
                    <select
                        disabled={readOnly}
                        value={q.answerType}
                        onChange={(e) =>
                            onUpdateQuestion(categoryId, q.id, { answerType: e.target.value as "Single" | "Multiple" })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    >
                        <option value="Single">{t('features.admin.ethics.questionCard.answerType.single')}</option>
                        <option value="Multiple">{t('features.admin.ethics.questionCard.answerType.multiple')}</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.orderLabel')}</label>
                    <input
                        disabled={readOnly}
                        type="number"
                        value={q.order}
                        onChange={(e) => onUpdateQuestion(categoryId, q.id, { order: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="flex items-end justify-end">
                    <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => onDeleteQuestion(categoryId, q.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                        {t('features.admin.ethics.questionCard.deleteButton')}
                    </button>
                </div>
            </div>

            {/* Options */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">{t('features.admin.ethics.questionCard.optionsTitle')}</div>
                <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => onAddOption(categoryId, q.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <Plus size={16} /> {t('features.admin.ethics.questionCard.addOptionButton')}
                </button>
            </div>

            <div className="mt-3 space-y-2">
                {q.options
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((o) => (
                        <div key={o.id} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-12 md:col-span-3">
                                <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.keyLabel')}</label>
                                <input
                                    disabled={readOnly}
                                    value={o.key}
                                    onChange={(e) => onUpdateOption(categoryId, q.id, o.id, { key: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div className="col-span-12 md:col-span-5">
                                <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.labelLabel')}</label>
                                <input
                                    disabled={readOnly}
                                    value={o.label}
                                    onChange={(e) => onUpdateOption(categoryId, q.id, o.id, { label: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                />
                                {searchQuery.trim() ? (
                                    <div className="mt-1 text-xs text-gray-600">{highlight(o.label, searchQuery)}</div>
                                ) : null}
                            </div>

                            <div className="col-span-6 md:col-span-2">
                                <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.scoreLabel')}</label>
                                <input
                                    disabled={readOnly}
                                    type="number"
                                    step="0.1"
                                    value={o.score}
                                    onChange={(e) => onUpdateOption(categoryId, q.id, o.id, { score: Number(e.target.value) })}
                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div className="col-span-4 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-600">{t('features.admin.ethics.questionCard.orderLabel')}</label>
                                <input
                                    disabled={readOnly}
                                    type="number"
                                    value={o.order}
                                    onChange={(e) => onUpdateOption(categoryId, q.id, o.id, { order: Number(e.target.value) })}
                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1 flex justify-end">
                                <button
                                    type="button"
                                    disabled={readOnly}
                                    onClick={() => onDeleteOption(categoryId, q.id, o.id)}
                                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                    title={t('features.admin.ethics.questionCard.deleteButton')}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                {q.options.length === 0 ? (
                    <div className="text-sm text-gray-500">{t('features.admin.ethics.questionCard.noOptions')}</div>
                ) : null}
            </div>
        </div>
    );
};
