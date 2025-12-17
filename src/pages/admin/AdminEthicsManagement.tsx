/*
/!*
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";

import {useAdminEthicsCatalog} from "@/hooks/Admin/useAdminEthicsForm";
import { EthicsCategoryDto, EthicsFormDto, EthicsOptionDto, EthicsQuestionDto } from "@/api/services/ethics/types";

import { EthicsStatusBanner } from "@/features/admin/ethics/EthicsStatusBanner";
import { EthicsAdminHeroBanner } from "@/features/admin/ethics/EthicsAdminHeroBanner";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

import { filterFormForSearch } from "@/features/admin/ethics/utils/search";
import { EthicsCategoriesSidebar } from "@/features/admin/ethics/components/EthicsCategoriesSidebar";
import { EthicsCategoryEditor } from "@/features/admin/ethics/components/EthicsCategoryEditor";

const newTempId = (() => {
    let i = -1;
    return () => i--;
})();

export const AdminEthicsManagement: React.FC = () => {
    const { data, setData, loading, saving, error, saveCatalog } = useAdminEthicsCatalog();

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const form = data;

    useEffect(() => {
        if (form && selectedCategoryId == null) {
            setSelectedCategoryId(form.categories[0]?.id ?? null);
        }
    }, [form, selectedCategoryId]);

    const displayedCategories = useMemo(() => {
        if (!form) return [];
        return filterFormForSearch(form, searchQuery);
    }, [form, searchQuery]);

    useEffect(() => {
        if (!form) return;
        if (selectedCategoryId == null) return;
        const stillVisible = displayedCategories.some((c) => c.id === selectedCategoryId);
        if (!stillVisible) setSelectedCategoryId(displayedCategories[0]?.id ?? null);
    }, [form, displayedCategories, selectedCategoryId]);

    const selectedCategory = useMemo(() => {
        if (!form) return null;
        const id = selectedCategoryId ?? displayedCategories[0]?.id ?? null;
        return displayedCategories.find((c) => c.id === id) ?? null;
    }, [form, displayedCategories, selectedCategoryId]);

    // ----- Updaters -----
    const updateForm = (patch: Partial<EthicsFormDto>) => {
        if (!form) return;
        setData({ ...form, ...patch });
    };

    const updateCategory = (categoryId: number, patch: Partial<EthicsCategoryDto>) => {
        if (!form) return;
        updateForm({
            categories: form.categories.map((c) => (c.id === categoryId ? { ...c, ...patch } : c)),
        });
    };

    const addCategory = () => {
        if (!form || readOnly) return;
        const id = newTempId();
        const nextOrder = (form.categories.at(-1)?.order ?? 0) + 1;

        const c: EthicsCategoryDto = {
            id,
            key: `category_${Math.abs(id)}`,
            label: "Nouvelle catégorie",
            order: nextOrder,
            questions: [],
        };

        updateForm({ categories: [...form.categories, c] });
        setSelectedCategoryId(id);
    };

    const deleteCategory = (categoryId: number) => {
        if (!form || readOnly) return;
        const next = form.categories.filter((c) => c.id !== categoryId);
        updateForm({ categories: next });
        setSelectedCategoryId(next[0]?.id ?? null);
    };

    const addQuestion = (categoryId: number) => {
        if (!form || readOnly) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        if (!cat) return;

        const id = newTempId();
        const nextOrder = (cat.questions.at(-1)?.order ?? 0) + 1;

        const q: EthicsQuestionDto = {
            id,
            key: `question_${Math.abs(id)}`,
            label: "Nouvelle question",
            order: nextOrder,
            answerType: "Single",
            options: [],
            selectedOptionIds: [],
        };

        updateCategory(categoryId, { questions: [...cat.questions, q] });
    };

    const deleteQuestion = (categoryId: number, questionId: number) => {
        if (!form || readOnly) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        if (!cat) return;
        updateCategory(categoryId, { questions: cat.questions.filter((q) => q.id !== questionId) });
    };

    const updateQuestion = (categoryId: number, questionId: number, patch: Partial<EthicsQuestionDto>) => {
        if (!form || readOnly) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        if (!cat) return;

        updateCategory(categoryId, {
            questions: cat.questions.map((q) => (q.id === questionId ? { ...q, ...patch } : q)),
        });
    };

    const addOption = (categoryId: number, questionId: number) => {
        if (!form || readOnly) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        const id = newTempId();
        const nextOrder = (q.options.at(-1)?.order ?? 0) + 1;

        const opt: EthicsOptionDto = {
            id,
            key: `option_${Math.abs(id)}`,
            label: "Nouvelle option",
            order: nextOrder,
            score: 0,
        };

        updateQuestion(categoryId, questionId, { options: [...q.options, opt] });
    };

    const deleteOption = (categoryId: number, questionId: number, optionId: number) => {
        if (!form || readOnly) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        updateQuestion(categoryId, questionId, { options: q.options.filter((o) => o.id !== optionId) });
    };

    const updateOption = (categoryId: number, questionId: number, optionId: number, patch: Partial<EthicsOptionDto>) => {
        if (!form || readOnly) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        updateQuestion(categoryId, questionId, {
            options: q.options.map((o) => (o.id === optionId ? { ...o, ...patch } : o)),
        });
    };

    const readOnly = false;

    const handleSave = async () => {
        if (!form) return;

        for (const c of form.categories) {
            if (!c.key.trim() || !c.label.trim()) return alert("Catégorie: Key/Label requis");
            for (const q of c.questions) {
                if (!q.key.trim() || !q.label.trim()) return alert("Question: Key/Label requis");
                if (q.options.length < 2) return alert(`Question "${q.label}" : au moins 2 options`);
                for (const o of q.options) {
                    if (!o.key.trim() || !o.label.trim()) return alert("Option: Key/Label requis");
                }
            }
        }

        await saveCatalog(form);
    };

    // Publish / Unpublish = sauvegarde du catalogue + status UI
    const publish = async () => {
        if (!form) return;
        const next = { ...form, status: "Published" as any };
        setData(next);
        await saveCatalog(next);
    };

    const unpublish = async () => {
        if (!form) return;
        const next = { ...form, status: "Draft" as any };
        setData(next);
        await saveCatalog(next);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!form) {
        return <div className="p-6">Impossible de charger le questionnaire. {error}</div>;
    }

    return (
        <>
            <AuthPanel />

            <div className="mx-auto max-w-6xl px-4 py-6">
                <EthicsAdminHeroBanner
                    status={form.status}
                    readOnly={readOnly}
                />

                <div className="space-y-4">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Questionnaire éthique (Admin)</h1>
                        <p className="text-sm text-gray-600">
                            Catalogue : catégories, questions, options. Le statut pilote le mode édition.
                        </p>
                        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
                    </div>

                    <EthicsStatusBanner
                        status={form.status}
                        disabled={saving}
                        onPublish={publish}
                        onUnpublish={unpublish}
                    />


                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || readOnly}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                            title={readOnly ? "Lecture seule dans ce statut" : undefined}
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Enregistrer
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-4">
                    {/!* Sidebar *!/}
                    <div className="col-span-12 md:col-span-4 lg:col-span-3">
                        <EthicsCategoriesSidebar
                            categories={displayedCategories}
                            selectedCategoryId={selectedCategoryId}
                            onSelect={setSelectedCategoryId}
                            onAdd={addCategory}
                            readOnly={readOnly}
                            searchQuery={searchQuery}
                        />
                    </div>

                    {/!* Editor *!/}
                    <div className="col-span-12 md:col-span-8 lg:col-span-9">
                        <EthicsCategoryEditor
                            category={selectedCategory}
                            readOnly={readOnly}
                            searchQuery={searchQuery}
                            onUpdateCategory={updateCategory}
                            onDeleteCategory={deleteCategory}
                            onAddQuestion={addQuestion}
                            onUpdateQuestion={updateQuestion}
                            onDeleteQuestion={deleteQuestion}
                            onAddOption={addOption}
                            onUpdateOption={updateOption}
                            onDeleteOption={deleteOption}
                        />
                    </div>
                </div>
            </div>

            {/!* Search bar *!/}
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
*!/
import React, { useEffect, useMemo, useState } from "react";
import {Loader2, Save, X} from "lucide-react";

import { useAdminEthicsCatalog } from "@/hooks/Admin/useAdminEthicsForm";
import { EthicsCategoryDto, EthicsFormDto, EthicsOptionDto, EthicsQuestionDto } from "@/api/services/ethics/superVendor/types";

import { EthicsStatusBanner } from "@/features/admin/ethics/EthicsStatusBanner";
import { EthicsAdminHeroBanner } from "@/features/admin/ethics/EthicsAdminHeroBanner";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

import { filterFormForSearch } from "@/features/admin/ethics/utils/search";
import { EthicsCategoriesSidebar } from "@/features/admin/ethics/components/EthicsCategoriesSidebar";
import { EthicsCategoryEditor } from "@/features/admin/ethics/components/EthicsCategoryEditor";

const newTempId = (() => {
    let i = -1;
    return () => i--;
})();

export const AdminEthicsManagement: React.FC = () => {
    const { data, setData, loading, saving, error, saveCatalog } = useAdminEthicsCatalog();

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const form = data;

    useEffect(() => {
        if (form && selectedCategoryId == null) {
            setSelectedCategoryId(form.categories[0]?.id ?? null);
        }
    }, [form, selectedCategoryId]);

    // Admin catalogue: éditable
    const readOnly = false;

    const displayedCategories = useMemo(() => {
        if (!form) return [];
        return filterFormForSearch(form, searchQuery);
    }, [form, searchQuery]);

    useEffect(() => {
        if (!form) return;
        if (selectedCategoryId == null) return;
        const stillVisible = displayedCategories.some((c) => c.id === selectedCategoryId);
        if (!stillVisible) setSelectedCategoryId(displayedCategories[0]?.id ?? null);
    }, [form, displayedCategories, selectedCategoryId]);

    const selectedCategory = useMemo(() => {
        if (!form) return null;
        const id = selectedCategoryId ?? displayedCategories[0]?.id ?? null;
        return displayedCategories.find((c) => c.id === id) ?? null;
    }, [form, displayedCategories, selectedCategoryId]);

    // ----- Updaters -----
    const updateForm = (patch: Partial<EthicsFormDto>) => {
        if (!form) return;
        setData({ ...form, ...patch });
    };

    const updateCategory = (categoryId: number, patch: Partial<EthicsCategoryDto>) => {
        if (!form) return;
        updateForm({
            categories: form.categories.map((c) => (c.id === categoryId ? { ...c, ...patch } : c)),
        });
    };

    const addCategory = () => {
        if (!form) return;
        const id = newTempId();
        const nextOrder = (form.categories.at(-1)?.order ?? 0) + 1;

        const c: EthicsCategoryDto = {
            id,
            key: `category_${Math.abs(id)}`,
            label: "Nouvelle catégorie",
            order: nextOrder,
            questions: [],
        };

        updateForm({ categories: [...form.categories, c] });
        setSelectedCategoryId(id);
    };

    const deleteCategory = (categoryId: number) => {
        if (!form) return;
        const next = form.categories.filter((c) => c.id !== categoryId);
        updateForm({ categories: next });
        setSelectedCategoryId(next[0]?.id ?? null);
    };

    const addQuestion = (categoryId: number) => {
        if (!form) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        if (!cat) return;

        const id = newTempId();
        const nextOrder = (cat.questions.at(-1)?.order ?? 0) + 1;

        const q: EthicsQuestionDto = {
            id,
            key: `question_${Math.abs(id)}`,
            label: "Nouvelle question",
            order: nextOrder,
            answerType: "Single",
            options: [],
            selectedOptionIds: [],
        };

        updateCategory(categoryId, { questions: [...cat.questions, q] });
    };

    const deleteQuestion = (categoryId: number, questionId: number) => {
        if (!form) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        if (!cat) return;
        updateCategory(categoryId, { questions: cat.questions.filter((q) => q.id !== questionId) });
    };

    const updateQuestion = (categoryId: number, questionId: number, patch: Partial<EthicsQuestionDto>) => {
        if (!form) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        if (!cat) return;

        updateCategory(categoryId, {
            questions: cat.questions.map((q) => (q.id === questionId ? { ...q, ...patch } : q)),
        });
    };

    const addOption = (categoryId: number, questionId: number) => {
        if (!form) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        const id = newTempId();
        const nextOrder = (q.options.at(-1)?.order ?? 0) + 1;

        const opt: EthicsOptionDto = {
            id,
            key: `option_${Math.abs(id)}`,
            label: "Nouvelle option",
            order: nextOrder,
            score: 0,
        };

        updateQuestion(categoryId, questionId, { options: [...q.options, opt] });
    };

    const deleteOption = (categoryId: number, questionId: number, optionId: number) => {
        if (!form) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        updateQuestion(categoryId, questionId, { options: q.options.filter((o) => o.id !== optionId) });
    };

    const updateOption = (categoryId: number, questionId: number, optionId: number, patch: Partial<EthicsOptionDto>) => {
        if (!form) return;
        const cat = form.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        updateQuestion(categoryId, questionId, {
            options: q.options.map((o) => (o.id === optionId ? { ...o, ...patch } : o)),
        });
    };

    const handleSave = async () => {
        if (!form) return;

        for (const c of form.categories) {
            if (!c.key.trim() || !c.label.trim()) return alert("Catégorie: Key/Label requis");
            for (const q of c.questions) {
                if (!q.key.trim() || !q.label.trim()) return alert("Question: Key/Label requis");
                if (q.options.length < 2) return alert(`Question "${q.label}" : au moins 2 options`);
                for (const o of q.options) {
                    if (!o.key.trim() || !o.label.trim()) return alert("Option: Key/Label requis");
                }
            }
        }

        await saveCatalog(form);
    };

    const publish = async () => {
        if (!form) return;
        const next = { ...form, status: "Published" as any };
        setData(next);
        await saveCatalog(next);
    };

    const unpublish = async () => {
        if (!form) return;
        const next = { ...form, status: "Draft" as any };
        setData(next);
        await saveCatalog(next);
    };

    if (loading) {
        return (
            <>
                <AuthPanel />
                <main className="relative bg-white min-h-screen mx-auto pb-16">
                    <EthicsAdminHeroBanner />
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                </main>
                <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
            </>
        );
    }

    if (!form) {
        return (
            <>
            <AuthPanel />
            <main className="relative bg-white min-h-screen mx-auto pb-16">
                <EthicsAdminHeroBanner />
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <X size={48} className="text-red-500" />
                    <div className="p-6">Impossible de charger le catalogue. {error}</div>
                </div>
            </main>
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
            </>
        );
    }

    return (
        <>
            <AuthPanel />
            <main className="relative bg-white min-h-screen mx-auto pb-16">
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <EthicsAdminHeroBanner />

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Catalogue éthique (Admin)</h1>
                            <p className="text-sm text-gray-600">Catégories, questions, options. Admin = source de vérité.</p>
                            {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
                        </div>

                        <EthicsStatusBanner
                            status={form.status}
                            disabled={saving}
                            onPublish={publish}
                            onUnpublish={unpublish}
                        />

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Enregistrer
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-4 lg:col-span-3">
                            <EthicsCategoriesSidebar
                                categories={displayedCategories}
                                selectedCategoryId={selectedCategoryId}
                                onSelect={setSelectedCategoryId}
                                onAdd={addCategory}
                                readOnly={readOnly}
                                searchQuery={searchQuery}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-8 lg:col-span-9">
                            <EthicsCategoryEditor
                                category={selectedCategory}
                                readOnly={readOnly}
                                searchQuery={searchQuery}
                                onUpdateCategory={updateCategory}
                                onDeleteCategory={deleteCategory}
                                onAddQuestion={addQuestion}
                                onUpdateQuestion={updateQuestion}
                                onDeleteQuestion={deleteQuestion}
                                onAddOption={addOption}
                                onUpdateOption={updateOption}
                                onDeleteOption={deleteOption}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
*/
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Save, UploadCloud, EyeOff, X } from "lucide-react";

import { useAdminEthicsCatalog } from "@/hooks/Admin/useAdminEthicsForm"; // <-- ton hook admin
import type {
    AdminCatalogDto,
    AdminUpsertCatalogRequest,
} from "@/api/services/ethics/admin/types"; // <-- types ADMIN (pas supervendor)

import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

import { EthicsCategoriesSidebar } from "@/features/admin/ethics/components/EthicsCategoriesSidebar";
import { EthicsCategoryEditor } from "@/features/admin/ethics/components/EthicsCategoryEditor";
import {EthicsAdminHeroBanner} from "@/features/admin/ethics/EthicsAdminHeroBanner";

/** -------------------------
 *  UI VM (nested) ADMIN
 *  ------------------------- */
type AdminOptionVM = {
    id: number;
    questionKey: string;
    key: string;
    label: string;
    order: number;
    score: number;
    isActive: boolean;
};

type AdminQuestionVM = {
    id: number;
    categoryKey: string;
    key: string;
    label: string;
    order: number;
    answerType: "Single" | "Multiple";
    isActive: boolean;
    options: AdminOptionVM[];
};

type AdminCategoryVM = {
    id: number;
    key: string;
    label: string;
    order: number;
    isActive: boolean;
    questions: AdminQuestionVM[];
};

type AdminCatalogVM = {
    categories: AdminCategoryVM[];
};

const newTempId = (() => {
    let i = -1;
    return () => i--;
})();

const normalizeAnswerType = (v: any): "Single" | "Multiple" => {
    if (v === "Single" || v === "Multiple") return v;
    if (v === 0 || v === "0") return "Single";
    if (v === 1 || v === "1") return "Multiple";
    return "Single";
};

/** Flat (DTO) -> Nested (VM) */
function dtoToVm(dto: AdminCatalogDto): AdminCatalogVM {
    const catsByKey = new Map<string, AdminCategoryVM>();

    for (const c of dto.categories ?? []) {
        catsByKey.set(c.key, {
            id: c.id,
            key: c.key,
            label: c.label,
            order: c.order,
            isActive: c.isActive,
            questions: [],
        });
    }

    const questionsByKey = new Map<string, AdminQuestionVM>();
    for (const q of dto.questions ?? []) {
        const cat = catsByKey.get(q.categoryKey);
        if (!cat) continue;

        const qVm: AdminQuestionVM = {
            id: q.id,
            categoryKey: q.categoryKey,
            key: q.key,
            label: q.label,
            order: q.order,
            answerType: normalizeAnswerType(q.answerType),
            isActive: q.isActive,
            options: [],
        };

        cat.questions.push(qVm);
        questionsByKey.set(q.key, qVm);
    }

    for (const o of dto.options ?? []) {
        const q = questionsByKey.get(o.questionKey);
        if (!q) continue;

        q.options.push({
            id: o.id,
            questionKey: o.questionKey,
            key: o.key,
            label: o.label,
            order: o.order,
            score: Number(o.score ?? 0),
            isActive: o.isActive,
        });
    }

    const categories = Array.from(catsByKey.values())
        .sort((a, b) => a.order - b.order)
        .map((c) => ({
            ...c,
            questions: c.questions
                .sort((a, b) => a.order - b.order)
                .map((q) => ({ ...q, options: q.options.sort((a, b) => a.order - b.order) })),
        }));

    return { categories };
}

/** Nested (VM) -> Upsert (Option B : keys) */
function vmToUpsert(vm: AdminCatalogVM): AdminUpsertCatalogRequest {
    return {
        categories: vm.categories.map((c) => ({
            id: c.id > 0 ? c.id : null,
            key: c.key.trim(),
            label: c.label.trim(),
            order: c.order,
            isActive: c.isActive,
        })),
        questions: vm.categories.flatMap((c) =>
            c.questions.map((q) => ({
                id: q.id > 0 ? q.id : null,
                categoryKey: c.key.trim(), // ✅ Option B
                key: q.key.trim(),
                label: q.label.trim(),
                order: q.order,
                answerType: normalizeAnswerType(q.answerType),
                isActive: q.isActive,
            }))
        ),
        options: vm.categories.flatMap((c) =>
            c.questions.flatMap((q) =>
                q.options.map((o) => ({
                    id: o.id > 0 ? o.id : null,
                    questionKey: q.key.trim(), // ✅ Option B
                    key: o.key.trim(),
                    label: o.label.trim(),
                    order: o.order,
                    score: Number(o.score ?? 0),
                    isActive: o.isActive,
                }))
            )
        ),
    };
}

function filterVmForSearch(vm: AdminCatalogVM, q: string): AdminCategoryVM[] {
    const s = q.trim().toLowerCase();
    if (!s) return vm.categories;

    return vm.categories
        .map((c) => {
            const catMatch =
                c.key.toLowerCase().includes(s) || c.label.toLowerCase().includes(s);

            const questions = c.questions
                .map((qu) => {
                    const qMatch =
                        qu.key.toLowerCase().includes(s) || qu.label.toLowerCase().includes(s);

                    const options = qu.options.filter(
                        (o) =>
                            o.key.toLowerCase().includes(s) || o.label.toLowerCase().includes(s)
                    );

                    if (qMatch) return { ...qu };
                    if (options.length) return { ...qu, options };
                    return null;
                })
                .filter(Boolean) as AdminQuestionVM[];

            if (catMatch) return { ...c };
            if (questions.length) return { ...c, questions };
            return null;
        })
        .filter(Boolean) as AdminCategoryVM[];
}

export const AdminEthicsManagement: React.FC = () => {
    const { data, loading, saving, error, saveCatalog } = useAdminEthicsCatalog();
    // data = AdminCatalogDto | null
    // saveCatalog(payload: AdminUpsertCatalogRequest) => Promise<AdminCatalogDto> (ou boolean, selon ton hook)

    const [vm, setVm] = useState<AdminCatalogVM | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!data) return;
        const mapped = dtoToVm(data);
        setVm(mapped);
        if (selectedCategoryId == null) setSelectedCategoryId(mapped.categories[0]?.id ?? null);
    }, [data, selectedCategoryId]);

    const displayedCategories = useMemo(() => {
        if (!vm) return [];
        return filterVmForSearch(vm, searchQuery);
    }, [vm, searchQuery]);

    useEffect(() => {
        if (!vm) return;
        if (selectedCategoryId == null) return;
        const stillVisible = displayedCategories.some((c) => c.id === selectedCategoryId);
        if (!stillVisible) setSelectedCategoryId(displayedCategories[0]?.id ?? null);
    }, [displayedCategories, selectedCategoryId, vm]);

    const selectedCategory = useMemo(() => {
        if (!vm) return null;
        const id = selectedCategoryId ?? displayedCategories[0]?.id ?? null;
        return displayedCategories.find((c) => c.id === id) ?? null;
    }, [displayedCategories, selectedCategoryId, vm]);

    const updateVm = (patch: Partial<AdminCatalogVM>) => {
        if (!vm) return;
        setVm({ ...vm, ...patch });
    };

    const updateCategory = (categoryId: number, patch: Partial<AdminCategoryVM>) => {
        if (!vm) return;

        updateVm({
            categories: vm.categories.map((c) => {
                if (c.id !== categoryId) return c;

                // si la clé de catégorie change : on propage categoryKey aux questions
                const nextKey = (patch.key ?? c.key).trim();
                const next = { ...c, ...patch, key: nextKey };

                return {
                    ...next,
                    questions: next.questions.map((q) => ({ ...q, categoryKey: nextKey })),
                };
            }),
        });
    };

    const addCategory = () => {
        if (!vm) return;

        const id = newTempId();
        const nextOrder = (vm.categories.at(-1)?.order ?? 0) + 1;

        const c: AdminCategoryVM = {
            id,
            key: `category_${Math.abs(id)}`,
            label: "Nouvelle catégorie",
            order: nextOrder,
            isActive: true,
            questions: [],
        };

        updateVm({ categories: [...vm.categories, c] });
        setSelectedCategoryId(id);
    };

    const deleteCategory = (categoryId: number) => {
        if (!vm) return;
        const next = vm.categories.filter((c) => c.id !== categoryId);
        updateVm({ categories: next });
        setSelectedCategoryId(next[0]?.id ?? null);
    };

    const addQuestion = (categoryId: number) => {
        if (!vm) return;
        const cat = vm.categories.find((c) => c.id === categoryId);
        if (!cat) return;

        const id = newTempId();
        const nextOrder = (cat.questions.at(-1)?.order ?? 0) + 1;

        const q: AdminQuestionVM = {
            id,
            categoryKey: cat.key,
            key: `question_${Math.abs(id)}`,
            label: "Nouvelle question",
            order: nextOrder,
            answerType: "Single",
            isActive: true,
            options: [],
        };

        updateCategory(categoryId, { questions: [...cat.questions, q] });
    };

    const updateQuestion = (categoryId: number, questionId: number, patch: Partial<AdminQuestionVM>) => {
        if (!vm) return;
        const cat = vm.categories.find((c) => c.id === categoryId);
        if (!cat) return;

        const updatedQuestions = cat.questions.map((q) => {
            if (q.id !== questionId) return q;

            const nextKey = (patch.key ?? q.key).trim();
            const next = { ...q, ...patch, key: nextKey, categoryKey: cat.key };

            // si la clé change : on propage questionKey aux options
            return { ...next, options: next.options.map((o) => ({ ...o, questionKey: nextKey })) };
        });

        updateCategory(categoryId, { questions: updatedQuestions });
    };

    const deleteQuestion = (categoryId: number, questionId: number) => {
        if (!vm) return;
        const cat = vm.categories.find((c) => c.id === categoryId);
        if (!cat) return;
        updateCategory(categoryId, { questions: cat.questions.filter((q) => q.id !== questionId) });
    };

    const addOption = (categoryId: number, questionId: number) => {
        if (!vm) return;
        const cat = vm.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        const id = newTempId();
        const nextOrder = (q.options.at(-1)?.order ?? 0) + 1;

        const opt: AdminOptionVM = {
            id,
            questionKey: q.key,
            key: `option_${Math.abs(id)}`,
            label: "Nouvelle option",
            order: nextOrder,
            score: 0,
            isActive: true,
        };

        updateQuestion(categoryId, questionId, { options: [...q.options, opt] });
    };

    const updateOption = (categoryId: number, questionId: number, optionId: number, patch: Partial<AdminOptionVM>) => {
        if (!vm) return;
        const cat = vm.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        updateQuestion(categoryId, questionId, {
            options: q.options.map((o) => (o.id === optionId ? { ...o, ...patch } : o)),
        });
    };

    const deleteOption = (categoryId: number, questionId: number, optionId: number) => {
        if (!vm) return;
        const cat = vm.categories.find((c) => c.id === categoryId);
        const q = cat?.questions.find((x) => x.id === questionId);
        if (!cat || !q) return;

        updateQuestion(categoryId, questionId, { options: q.options.filter((o) => o.id !== optionId) });
    };

    const validateVm = (v: AdminCatalogVM) => {
        for (const c of v.categories) {
            if (!c.key.trim() || !c.label.trim()) return "Catégorie: Key/Label requis";
            for (const q of c.questions) {
                if (!q.key.trim() || !q.label.trim()) return "Question: Key/Label requis";
                if (q.options.length < 2) return `Question "${q.label}" : au moins 2 options`;
                for (const o of q.options) {
                    if (!o.key.trim() || !o.label.trim()) return "Option: Key/Label requis";
                }
            }
        }
        return null;
    };

    const handleSave = async () => {
        if (!vm) return;

        const err = validateVm(vm);
        if (err) return alert(err);

        const payload = vmToUpsert(vm);
        await saveCatalog(payload);
    };

    const publishAll = async () => {
        if (!vm) return;
        const next: AdminCatalogVM = {
            categories: vm.categories.map((c) => ({
                ...c,
                isActive: true,
                questions: c.questions.map((q) => ({
                    ...q,
                    isActive: true,
                    options: q.options.map((o) => ({ ...o, isActive: true })),
                })),
            })),
        };
        setVm(next);

        const payload = vmToUpsert(next);
        await saveCatalog(payload);
    };

    const unpublishAll = async () => {
        if (!vm) return;
        const next: AdminCatalogVM = {
            categories: vm.categories.map((c) => ({
                ...c,
                isActive: false,
                questions: c.questions.map((q) => ({
                    ...q,
                    isActive: false,
                    options: q.options.map((o) => ({ ...o, isActive: false })),
                })),
            })),
        };
        setVm(next);

        const payload = vmToUpsert(next);
        await saveCatalog(payload);
    };

    if (loading) {
        return (
            <>
                <AuthPanel />
                <main className="relative bg-white min-h-screen mx-auto pb-16">
                    <EthicsAdminHeroBanner />
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                </main>
                <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
            </>
        );
    }

    if (!vm) {
        return (
            <>
                <AuthPanel />
                <main className="relative bg-white min-h-screen mx-auto pb-16">
                    <EthicsAdminHeroBanner />
                    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                        <X size={48} className="text-red-500" />
                        <div className="p-6">Impossible de charger le catalogue. {error}</div>
                    </div>
                </main>
                <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
            </>
        );
    }

    const readOnly = false;

    return (
        <>
            <AuthPanel />
            <main className="relative bg-white min-h-screen mx-auto pb-16">
                <EthicsAdminHeroBanner />
                <div className="mx-auto max-w-6xl px-4 py-6">
                <div className="space-y-3">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Catalogue éthique (Admin)</h1>
                        <p className="text-sm text-gray-600">
                            Tu édites la source de vérité : catégories → questions → options.
                        </p>
                        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={unpublishAll}
                            disabled={saving || readOnly}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <EyeOff size={16} />}
                            Dépublier
                        </button>

                        <button
                            type="button"
                            onClick={publishAll}
                            disabled={saving || readOnly}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                            Publier
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || readOnly}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Enregistrer
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4 lg:col-span-3">
                        <EthicsCategoriesSidebar
                            categories={displayedCategories as any} // structure-compatible
                            selectedCategoryId={selectedCategoryId}
                            onSelect={setSelectedCategoryId}
                            onAdd={addCategory}
                            readOnly={readOnly}
                            searchQuery={searchQuery}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-8 lg:col-span-9">
                        <EthicsCategoryEditor
                            category={selectedCategory as any} // structure-compatible
                            readOnly={readOnly}
                            searchQuery={searchQuery}
                            onUpdateCategory={updateCategory as any}
                            onDeleteCategory={deleteCategory}
                            onAddQuestion={addQuestion}
                            onUpdateQuestion={updateQuestion as any}
                            onDeleteQuestion={deleteQuestion}
                            onAddOption={addOption}
                            onUpdateOption={updateOption as any}
                            onDeleteOption={deleteOption}
                        />
                    </div>
                </div>
            </div>
            </main>
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
