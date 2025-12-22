import React, { useMemo, useRef, useState } from "react";
import { Loader2, Save, Plus, RefreshCcw, EyeOff, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import { EthicsAdminHeroBanner } from "@/features/admin/ethics/EthicsAdminHeroBanner";

import { useEthicsAdminCatalog } from "@/hooks/Admin/useEthicsAdminCatalog";

export const AdminEthicsManagement: React.FC = () => {
    const {
        catalog,
        categories,
        questions,
        options,
        questionsByCategory,
        optionsByQuestionKey,

        loading,
        saving,
        error,
        dirty,

        refetch,
        save,

        addQuestion,
        updateQuestion,
        toggleQuestionActive,

        addOption,
        updateOption,
        toggleOptionActive,
    } = useEthicsAdminCatalog(true);

    const [searchQuery, setSearchQuery] = useState("");
    const q = searchQuery.trim().toLowerCase();

    // 2 catégories fixes => onglets
    const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

    // pour gérer le rename de key (cascade option.questionKey)
    const lastKeyByClientIdRef = useRef<Map<string, string>>(new Map());

    // init tab au premier render utile
    React.useEffect(() => {
        if (!categories?.length) return;
        if (activeCategoryKey) return;
        setActiveCategoryKey(categories[0].key);
    }, [categories, activeCategoryKey]);

    const activeCategory = useMemo(() => {
        if (!activeCategoryKey) return null;
        return categories.find(c => c.key === activeCategoryKey) ?? null;
    }, [categories, activeCategoryKey]);

    const visibleQuestions = useMemo(() => {
        if (!activeCategoryKey) return [];
        const list = (questionsByCategory.get(activeCategoryKey) ?? []).slice();

        if (!q) return list;

        return list.filter(qu => {
            const inQ =
                qu.key.toLowerCase().includes(q) ||
                qu.label.toLowerCase().includes(q);

            const opts = optionsByQuestionKey.get(qu.key) ?? [];
            const inO = opts.some(o =>
                o.key.toLowerCase().includes(q) ||
                o.label.toLowerCase().includes(q)
            );

            return inQ || inO;
        });
    }, [activeCategoryKey, questionsByCategory, optionsByQuestionKey, q]);

    // -------- helpers --------
    const cascadeQuestionKey = (questionClientId: string, newKey: string) => {
        const prevKey = lastKeyByClientIdRef.current.get(questionClientId);
        if (!prevKey) return;
        if (prevKey === newKey) return;

        // update options that were linked to the previous key
        for (const o of options) {
            if (o.questionKey === prevKey) {
                updateOption(o.clientId, { questionKey: newKey });
            }
        }

        lastKeyByClientIdRef.current.set(questionClientId, newKey);
    };

    const onQuestionKeyFocus = (questionClientId: string, currentKey: string) => {
        // snapshot au focus pour savoir ce qui a changé au blur
        lastKeyByClientIdRef.current.set(questionClientId, currentKey);
    };

    const validateBeforeSave = () => {
        // required + duplicates
        const errors: string[] = [];

        // Questions: required + unique per draft (le back le check)
        const byQKey = new Map<string, number>();
        for (const qu of questions) {
            if (!qu.key.trim()) errors.push("Une question a une Key vide.");
            if (!qu.label.trim()) errors.push(`Question "${qu.key || "?"}" : Label requis.`);
            if (!qu.categoryKey.trim()) errors.push(`Question "${qu.key || "?"}" : CategoryKey requis.`);

            const k = qu.key.trim().toLowerCase();
            if (k) byQKey.set(k, (byQKey.get(k) ?? 0) + 1);
        }
        for (const [k, count] of byQKey) {
            if (count > 1) errors.push(`Doublon Question.Key : "${k}"`);
        }

        // Options: required + unique per questionKey
        const byOpt = new Map<string, number>(); // `${questionKey}::${optKey}`
        for (const o of options) {
            if (!o.questionKey.trim()) errors.push(`Option "${o.key || "?"}" : QuestionKey requis.`);
            if (!o.key.trim()) errors.push("Une option a une Key vide.");
            if (!o.label.trim()) errors.push(`Option "${o.key || "?"}" : Label requis.`);

            const k = `${o.questionKey.trim().toLowerCase()}::${o.key.trim().toLowerCase()}`;
            if (o.questionKey.trim() && o.key.trim()) byOpt.set(k, (byOpt.get(k) ?? 0) + 1);
        }
        for (const [k, count] of byOpt) {
            if (count > 1) {
                const [qk, ok] = k.split("::");
                errors.push(`Doublon Option.Key "${ok}" pour la question "${qk}"`);
            }
        }

        // (optionnel) minimum 2 options par question active
        // -> tu peux commenter si tu veux autoriser 0/1 option en draft.
        for (const qu of questions) {
            const opts = options.filter(o => o.questionKey === qu.key);
            if (qu.isActive && opts.length < 2) {
                errors.push(`Question "${qu.key}" : au moins 2 options (actuellement ${opts.length}).`);
            }
        }

        return errors.length ? errors[0] : null; // renvoie la première erreur (simple)
    };

    const handleSave = async () => {
        const err = validateBeforeSave();
        if (err) {
            toast.error(err, { style: { borderRadius: "10px" } });
            return;
        }

        const ok = await save();
        if (ok) {
            toast.success("Catalogue sauvegardé ✅", { style: { borderRadius: "10px" } });
        } else {
            toast.error("Erreur lors de la sauvegarde.", { style: { borderRadius: "10px" } });
        }
    };

    const setAllActive = (active: boolean) => {
        // batch update : questions + options (pas les catégories)
        for (const qu of questions) updateQuestion(qu.clientId, { isActive: active });
        for (const o of options) updateOption(o.clientId, { isActive: active });
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

    if (!catalog || !categories?.length) {
        return (
            <>
                <AuthPanel />
                <main className="relative bg-white min-h-screen mx-auto pb-16">
                    <EthicsAdminHeroBanner />
                    <div className="mx-auto max-w-6xl px-4 py-10">
                        <div className="text-lg font-semibold text-gray-900">Catalogue éthique (Admin)</div>
                        <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                            Impossible de charger le catalogue{error ? ` : ${error}` : "."}
                        </div>
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                        >
                            <RefreshCcw size={16} /> Réessayer
                        </button>
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
                <EthicsAdminHeroBanner />

                <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Catalogue éthique (Admin • Draft)</h1>
                            <p className="text-sm text-gray-600">
                                Catégories fixes (enum). Tu édites les questions/options de la version draft.
                                {dirty ? <span className="ml-2 font-semibold text-gray-900">• Modifs non sauvegardées</span> : null}
                            </p>
                            {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => void refetch()}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <RefreshCcw size={16} />
                                Recharger
                            </button>

                            <button
                                type="button"
                                onClick={() => setAllActive(false)}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 disabled:opacity-50"
                                title="Met tout en inactif (archive)"
                            >
                                <EyeOff size={16} />
                                Tout archiver
                            </button>

                            <button
                                type="button"
                                onClick={() => setAllActive(true)}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                title="Met tout en actif"
                            >
                                <UploadCloud size={16} />
                                Tout activer
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !dirty}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                                title={!dirty ? "Aucune modification à enregistrer" : undefined}
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Enregistrer
                            </button>
                        </div>
                    </div>

                    {/* Tabs catégories (fixes) */}
                    <div className="flex items-center gap-2">
                        {categories
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map(c => (
                                <button
                                    key={c.key}
                                    type="button"
                                    onClick={() => setActiveCategoryKey(c.key)}
                                    className={[
                                        "px-4 py-2 rounded-xl border text-sm font-semibold",
                                        activeCategoryKey === c.key
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                                    ].join(" ")}
                                >
                                    {c.label}
                                </button>
                            ))}

                        <div className="ml-auto text-sm text-gray-600">
                            {activeCategory ? (
                                <span>
                  Catégorie: <span className="font-semibold text-gray-900">{activeCategory.label}</span>
                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Actions catégorie */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-gray-600">
                            {visibleQuestions.length} question(s) affichée(s)
                            {q ? <span> • filtre “{searchQuery}”</span> : null}
                        </div>

                        <button
                            type="button"
                            onClick={() => activeCategoryKey && addQuestion(activeCategoryKey)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                            disabled={!activeCategoryKey}
                        >
                            <Plus size={16} />
                            Ajouter une question
                        </button>
                    </div>

                    {/* Liste questions */}
                    <div className="space-y-4">
                        {visibleQuestions.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <p className="text-gray-600">Aucune question ne correspond à ta recherche.</p>
                            </div>
                        ) : (
                            visibleQuestions.map(qu => {
                                const quOptions = (optionsByQuestionKey.get(qu.key) ?? []).slice();

                                return (
                                    <div key={qu.clientId} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
                                        {/* Question header */}
                                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-500">Question Key</label>
                                                    <input
                                                        value={qu.key}
                                                        onFocus={() => onQuestionKeyFocus(qu.clientId, qu.key)}
                                                        onChange={e => updateQuestion(qu.clientId, { key: e.target.value })}
                                                        onBlur={e => cascadeQuestionKey(qu.clientId, e.target.value.trim())}
                                                        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                        placeholder="ex: MANUFACTURE_Q1"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-500">Label</label>
                                                    <input
                                                        value={qu.label}
                                                        onChange={e => updateQuestion(qu.clientId, { label: e.target.value })}
                                                        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                        placeholder="Texte de la question…"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-500">AnswerType</label>
                                                    <select
                                                        value={qu.answerType}
                                                        onChange={e => updateQuestion(qu.clientId, { answerType: e.target.value as any })}
                                                        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                    >
                                                        <option value="Single">Single (radio)</option>
                                                        <option value="Multiple">Multiple (checkbox)</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500">Order</label>
                                                        <input
                                                            type="number"
                                                            value={qu.order}
                                                            onChange={e => updateQuestion(qu.clientId, { order: Number(e.target.value) })}
                                                            className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                        />
                                                    </div>

                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleQuestionActive(qu.clientId)}
                                                            className={[
                                                                "w-full px-3 py-2 rounded-xl border text-sm font-semibold",
                                                                qu.isActive ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700",
                                                            ].join(" ")}
                                                        >
                                                            {qu.isActive ? "Active" : "Archivée"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:ml-4">
                                                <button
                                                    type="button"
                                                    onClick={() => addOption(qu.key)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                                                >
                                                    <Plus size={16} />
                                                    Ajouter une option
                                                </button>
                                            </div>
                                        </div>

                                        {/* Options */}
                                        <div className="mt-4">
                                            <div className="text-xs text-gray-500 mb-2">Options</div>

                                            {quOptions.length === 0 ? (
                                                <div className="text-sm text-gray-600 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3">
                                                    Aucune option (ajoute-en au moins 2 pour que la question soit “soumettable”).
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {quOptions.map(opt => (
                                                        <div
                                                            key={opt.clientId}
                                                            className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 rounded-xl border border-gray-200"
                                                        >
                                                            <div className="md:col-span-3">
                                                                <label className="text-xs text-gray-500">Option Key</label>
                                                                <input
                                                                    value={opt.key}
                                                                    onChange={e => updateOption(opt.clientId, { key: e.target.value })}
                                                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                                    placeholder="ex: YES"
                                                                />
                                                            </div>

                                                            <div className="md:col-span-5">
                                                                <label className="text-xs text-gray-500">Label</label>
                                                                <input
                                                                    value={opt.label}
                                                                    onChange={e => updateOption(opt.clientId, { label: e.target.value })}
                                                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                                    placeholder="Texte option…"
                                                                />
                                                            </div>

                                                            <div className="md:col-span-2">
                                                                <label className="text-xs text-gray-500">Score</label>
                                                                <input
                                                                    type="number"
                                                                    value={opt.score}
                                                                    onChange={e => updateOption(opt.clientId, { score: Number(e.target.value) })}
                                                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                                />
                                                            </div>

                                                            <div className="md:col-span-1">
                                                                <label className="text-xs text-gray-500">Order</label>
                                                                <input
                                                                    type="number"
                                                                    value={opt.order}
                                                                    onChange={e => updateOption(opt.clientId, { order: Number(e.target.value) })}
                                                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                                                />
                                                            </div>

                                                            <div className="md:col-span-1 flex items-end">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleOptionActive(opt.clientId)}
                                                                    className={[
                                                                        "w-full px-3 py-2 rounded-xl border text-sm font-semibold",
                                                                        opt.isActive ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700",
                                                                    ].join(" ")}
                                                                    title="Archive/active"
                                                                >
                                                                    {opt.isActive ? "OK" : "Off"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>

            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
