import React, { useMemo, useRef, useState } from "react";
import { Loader2, Save, Plus, RefreshCcw, UploadCloud, Trash2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import { EthicsAdminHeroBanner } from "@/features/admin/ethics/EthicsAdminHeroBanner";
import { PageSkeleton } from "@/components/skeletons";

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

        publishing,
        publish,
    } = useEthicsAdminCatalog(true);

    const [searchQuery, setSearchQuery] = useState("");
    const q = searchQuery.trim().toLowerCase();

    // 2 catégories fixes => onglets
    const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

    // Question sélectionnée pour l'édition
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

    // pour gérer le rename de key (cascade option.questionKey)
    const lastKeyByClientIdRef = useRef<Map<string, string>>(new Map());

    // init tab au premier render utile
    React.useEffect(() => {
        if (!categories?.length) return;
        if (activeCategoryKey) return;
        setActiveCategoryKey(categories[0].key);
    }, [categories, activeCategoryKey]);

    const _activeCategory = useMemo(() => {
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

    const selectedQuestion = useMemo(() => {
        if (!selectedQuestionId) return null;
        return questions.find(q => q.clientId === selectedQuestionId) ?? null;
    }, [selectedQuestionId, questions]);

    const selectedQuestionOptions = useMemo(() => {
        if (!selectedQuestion) return [];
        return (optionsByQuestionKey.get(selectedQuestion.key) ?? []).slice();
    }, [selectedQuestion, optionsByQuestionKey]);

    // -------- helpers --------
    const cascadeQuestionKey = (questionClientId: string, newKey: string) => {
        const prevKey = lastKeyByClientIdRef.current.get(questionClientId) || "";
        const trimmedNewKey = newKey.trim();

        if (prevKey === trimmedNewKey) return;

        for (const o of options) {
            if (o.questionKey === prevKey) {
                updateOption(o.clientId, { questionKey: trimmedNewKey });
            }
        }

        lastKeyByClientIdRef.current.set(questionClientId, trimmedNewKey);
    };

    const onQuestionKeyFocus = (questionClientId: string, currentKey: string) => {
        lastKeyByClientIdRef.current.set(questionClientId, currentKey);
    };

    const validateBeforeSave = () => {
        const errors: string[] = [];

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

        const byOpt = new Map<string, number>();
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

        for (const qu of questions) {
            const opts = options.filter(o => o.questionKey === qu.key);
            if (qu.isActive && opts.length < 2) {
                errors.push(`Question "${qu.key}" : au moins 2 options (actuellement ${opts.length}).`);
            }
        }

        return errors.length ? errors[0] : null;
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

    const _setAllActive = (active: boolean) => {
        for (const qu of questions) updateQuestion(qu.clientId, { isActive: active });
        for (const o of options) updateOption(o.clientId, { isActive: active });
    };

    const deleteQuestion = (clientId: string) => {
        if (selectedQuestionId === clientId) {
            setSelectedQuestionId(null);
        }
        const question = questions.find(q => q.clientId === clientId);
        if (question) {
            // Supprimer toutes les options associées
            const associatedOptions = options.filter(o => o.questionKey === question.key);
            for (const opt of associatedOptions) {
                updateOption(opt.clientId, { isActive: false }); // On les désactive plutôt que de les supprimer
            }
        }
        updateQuestion(clientId, { isActive: false }); // On désactive plutôt que de supprimer
        toast.success("Question archivée", { style: { borderRadius: "10px" } });
    };

    const deleteOption = (clientId: string) => {
        updateOption(clientId, { isActive: false });
        toast.success("Option archivée", { style: { borderRadius: "10px" } });
    };

    const handleAddQuestion = () => {
        if (!activeCategoryKey) return;
        addQuestion(activeCategoryKey);
        // Sélectionner automatiquement la nouvelle question
        setTimeout(() => {
            const newQuestion = questions[questions.length - 1];
            if (newQuestion) {
                setSelectedQuestionId(newQuestion.clientId);
            }
        }, 50);
    };

    const handlePublish = async () => {
        if (dirty) {
            toast.error("Enregistre d'abord tes modifications !", { style: { borderRadius: "10px" } });
            return;
        }

        const confirmMsg =
            "⚠️ ATTENTION : Publier cette version va :\n" +
            "• Remplacer la version active actuelle\n" +
            "• Migrer automatiquement les questionnaires en cours des marques\n" +
            "• Les marques devront re-vérifier leurs réponses si des questions ont changé\n\n" +
            "Es-tu sûr(e) de vouloir publier ?";

        if (!confirm(confirmMsg)) return;

        const ok = await publish();
        if (ok) {
            toast.success("🎉 Catalogue publié avec succès ! Les questionnaires ont été migrés.", {
                style: { borderRadius: "10px" },
                duration: 5000,
            });
        } else {
            toast.error("Erreur lors de la publication.", { style: { borderRadius: "10px" } });
        }
    };

    if (loading) {
        return <PageSkeleton />;
    }

    if (!catalog || !categories?.length) {
        return (
            <>
                <AuthPanel />
                <main className="relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mx-auto pb-16">
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
            <main className="relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen mx-auto pb-16">
                <EthicsAdminHeroBanner />

                <div className="mx-auto max-w-7xl px-4 py-6">
                    {/* Header */}
                    <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    Éditeur de questionnaire éthique
                                    {dirty && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg font-semibold">
                                            Non sauvegardé
                                        </span>
                                    )}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Gérez les questions et options du questionnaire éthique
                                </p>
                                {error ? <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} /> {error}</div> : null}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => void refetch()}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    <RefreshCcw size={16} />
                                    Recharger
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving || !dirty}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    title={!dirty ? "Aucune modification à enregistrer" : undefined}
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    disabled={saving || publishing || dirty}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    title={dirty ? "Sauvegarde d'abord tes modifications" : "Publier cette version (remplacera la version active)"}
                                >
                                    {publishing ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                                    Publier
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs catégories */}
                    <div className="mb-4 flex items-center gap-3">
                        {categories
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map(c => (
                                <button
                                    key={c.key}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategoryKey(c.key);
                                        setSelectedQuestionId(null);
                                    }}
                                    className={[
                                        "px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                                        activeCategoryKey === c.key
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
                                    ].join(" ")}
                                >
                                    {c.label}
                                </button>
                            ))}

                        <div className="ml-auto flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                disabled={!activeCategoryKey}
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <Plus size={18} />
                                Nouvelle question
                            </button>
                        </div>
                    </div>

                    {/* Layout 2 colonnes */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Colonne gauche : Liste des questions */}
                        <div className="lg:col-span-4 space-y-2">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-bold text-gray-900">
                                        Questions ({visibleQuestions.length})
                                    </h2>
                                </div>

                                {visibleQuestions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        Aucune question dans cette catégorie.
                                        <br />
                                        <button
                                            onClick={handleAddQuestion}
                                            className="mt-3 text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            + Créer la première
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                                        {visibleQuestions.map(qu => {
                                            const quOptions = (optionsByQuestionKey.get(qu.key) ?? []).slice();
                                            const isSelected = selectedQuestionId === qu.clientId;
                                            const hasIssue = !qu.key.trim() || !qu.label.trim() || quOptions.length < 2;

                                            return (
                                                <button
                                                    key={qu.clientId}
                                                    onClick={() => setSelectedQuestionId(qu.clientId)}
                                                    className={[
                                                        "w-full text-left p-3 rounded-lg border-2 transition-all group",
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-sm text-gray-900 truncate">
                                                                {qu.label || <span className="italic text-gray-400">Sans titre</span>}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                                                                {qu.key && (
                                                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                                                                        {qu.key}
                                                                    </span>
                                                                )}
                                                                <span>
                                                                    {quOptions.length} option{quOptions.length > 1 ? "s" : ""}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            {qu.isActive ? (
                                                                <CheckCircle2 size={16} className="text-green-600" />
                                                            ) : (
                                                                <X size={16} className="text-gray-400" />
                                                            )}
                                                            {hasIssue && qu.isActive && (
                                                                <AlertCircle size={14} className="text-orange-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Colonne droite : Éditeur de question */}
                        <div className="lg:col-span-8">
                            {!selectedQuestion ? (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Sélectionne une question
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Clique sur une question dans la liste de gauche pour l'éditer,
                                        <br />
                                        ou crée une nouvelle question.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    {/* Header de la question */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="text-xs font-semibold uppercase tracking-wide opacity-90 mb-2">
                                                    Question #{selectedQuestion.order}
                                                </div>
                                                <input
                                                    value={selectedQuestion.label}
                                                    onChange={e => updateQuestion(selectedQuestion.clientId, { label: e.target.value })}
                                                    className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 font-semibold text-lg focus:outline-none focus:border-white/40 transition-colors"
                                                    placeholder="Titre de la question..."
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Archiver cette question et toutes ses options ?")) {
                                                        deleteQuestion(selectedQuestion.clientId);
                                                    }
                                                }}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Archiver la question"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Corps de l'éditeur */}
                                    <div className="p-6 space-y-6">
                                        {/* Paramètres de la question */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Identifiant (Key)
                                                </label>
                                                <input
                                                    value={selectedQuestion.key}
                                                    onFocus={() => onQuestionKeyFocus(selectedQuestion.clientId, selectedQuestion.key)}
                                                    onChange={e => updateQuestion(selectedQuestion.clientId, { key: e.target.value })}
                                                    onBlur={e => cascadeQuestionKey(selectedQuestion.clientId, e.target.value.trim())}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow font-mono text-sm"
                                                    placeholder="MANUFACTURE_Q1"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Type de réponse
                                                    </label>
                                                    <select
                                                        value={selectedQuestion.answerType}
                                                        onChange={e => updateQuestion(selectedQuestion.clientId, { answerType: e.target.value as "Single" | "Multiple" })}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                                    >
                                                        <option value="Single">Unique</option>
                                                        <option value="Multiple">Multiple</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Ordre
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={selectedQuestion.order}
                                                        onChange={e => updateQuestion(selectedQuestion.clientId, { order: Number(e.target.value) })}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleQuestionActive(selectedQuestion.clientId)}
                                                className={[
                                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                                    selectedQuestion.isActive
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                                                ].join(" ")}
                                            >
                                                {selectedQuestion.isActive ? (
                                                    <>
                                                        <CheckCircle2 size={16} className="inline mr-2" />
                                                        Question active
                                                    </>
                                                ) : (
                                                    <>
                                                        <X size={16} className="inline mr-2" />
                                                        Question inactive
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200" />

                                        {/* Options de réponse */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Options de réponse
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const questionKey = selectedQuestion.key.trim();
                                                        if (!questionKey) {
                                                            toast.error("Définis d'abord la Question Key avant d'ajouter des options !",
                                                                { style: { borderRadius: "10px" } });
                                                            return;
                                                        }
                                                        addOption(questionKey);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                                >
                                                    <Plus size={16} />
                                                    Ajouter une option
                                                </button>
                                            </div>

                                            {selectedQuestionOptions.length === 0 ? (
                                                <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
                                                    <AlertCircle size={32} className="mx-auto text-gray-400 mb-3" />
                                                    <p className="text-sm text-gray-600 font-semibold mb-1">
                                                        Aucune option
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Ajoute au moins 2 options pour que la question soit valide
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {selectedQuestionOptions.map((opt, index) => (
                                                        <div
                                                            key={opt.clientId}
                                                            className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition-colors"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg border border-gray-300 text-sm font-semibold text-gray-600">
                                                                    {index + 1}
                                                                </div>

                                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                                                                    <div className="md:col-span-3">
                                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                                            Key
                                                                        </label>
                                                                        <input
                                                                            value={opt.key}
                                                                            onChange={e => updateOption(opt.clientId, { key: e.target.value })}
                                                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono bg-white"
                                                                            placeholder="YES"
                                                                        />
                                                                    </div>

                                                                    <div className="md:col-span-5">
                                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                                            Label
                                                                        </label>
                                                                        <input
                                                                            value={opt.label}
                                                                            onChange={e => updateOption(opt.clientId, { label: e.target.value })}
                                                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                                            placeholder="Texte de l'option"
                                                                        />
                                                                    </div>

                                                                    <div className="md:col-span-2">
                                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                                            Score
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={opt.score}
                                                                            onChange={e => updateOption(opt.clientId, { score: Number(e.target.value) })}
                                                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="md:col-span-2 flex items-end gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => toggleOptionActive(opt.clientId)}
                                                                            className={[
                                                                                "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                                                                                opt.isActive
                                                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300",
                                                                            ].join(" ")}
                                                                            title={opt.isActive ? "Active" : "Inactive"}
                                                                        >
                                                                            {opt.isActive ? "✓" : "✗"}
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (confirm("Archiver cette option ?")) {
                                                                                    deleteOption(opt.clientId);
                                                                                }
                                                                            }}
                                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                                            title="Archiver"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedQuestionOptions.length > 0 && selectedQuestionOptions.length < 2 && (
                                                <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                    <AlertCircle size={16} />
                                                    <span>
                                                        Au moins 2 options sont requises pour que la question soit valide
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
