import React, { useMemo } from "react";
import {SettingsNav, TabItem, TabKey} from "@/pages/settings/SettingsNav";


export type SettingsSearchItem = {
    id: string;
    tab: TabKey;
    title: string;
    description?: string;
    keywords: string[];
};

type Props = {
    tabs: TabItem[];
    active: TabKey;
    mounted: Record<TabKey, boolean>;
    onChangeTab: (key: TabKey) => void;

    searchQuery: string;
    searchIndex: SettingsSearchItem[];
    onGoToResult: (item: SettingsSearchItem) => void;
};

export const SettingsContent: React.FC<Props> = ({
                                                     tabs,
                                                     active,
                                                     mounted,
                                                     onChangeTab,
                                                     searchQuery,
                                                     searchIndex,
                                                     onGoToResult,
                                                 }) => {
    const results = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        return searchIndex
            .filter((it) => {
                const hay = [it.title, it.description ?? "", ...it.keywords].join(" ").toLowerCase();
                return hay.includes(q);
            })
            .slice(0, 12);
    }, [searchQuery, searchIndex]);

    const showResults = searchQuery.trim().length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <aside className="lg:sticky lg:top-6 h-fit">
                <SettingsNav tabs={tabs} active={active} onChange={onChangeTab} />
            </aside>

            <main className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {showResults ? (
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Résultats</h2>
                                <p className="text-gray-500 mt-1">Clique pour ouvrir le bon paramètre.</p>
                            </div>
                            <div className="text-sm text-gray-500">{results.length} trouvé(s)</div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {results.length === 0 ? (
                                <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-600">
                                    Rien trouvé. Essaie “carte”, “2FA”, “mot de passe”, “email”…
                                </div>
                            ) : (
                                results.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => onGoToResult(r)}
                                        className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{r.title}</div>
                                                {r.description ? (
                                                    <div className="text-sm text-gray-500 mt-1">{r.description}</div>
                                                ) : null}
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded bg-gray-900 text-white whitespace-nowrap">
                        {tabs.find((t) => t.key === r.tab)?.label ?? r.tab}
                      </span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Keep-alive panels */}
                <div>
                    {tabs.map((t) =>
                        mounted[t.key] ? (
                            <section
                                key={t.key}
                                aria-hidden={active !== t.key}
                                className={active === t.key ? "block" : "hidden"}
                            >
                                {t.element}
                            </section>
                        ) : null
                    )}
                </div>
            </main>
        </div>
    );
};
