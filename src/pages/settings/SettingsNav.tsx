import React from "react";

export type TabKey = "profile" | "payments" | "security" | "notifications";

export type TabItem = {
    key: TabKey;
    label: string;
    description?: string;
    element: React.ReactNode;
};

type Props = {
    tabs: TabItem[];
    active: TabKey;
    onChange: (key: TabKey) => void;
};

export const SettingsNav: React.FC<Props> = ({ tabs, active, onChange }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2">
            <div className="px-3 pt-3 pb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navigation
                </div>
            </div>

            <nav role="tablist" aria-label="Paramètres" className="p-2 space-y-1">
                {tabs.map((t) => {
                    const isActive = t.key === active;
                    return (
                        <button
                            key={t.key}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onChange(t.key)}
                            className={[
                                "w-full text-left rounded-lg px-3 py-3 transition-colors border",
                                isActive
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-900 border-transparent hover:bg-gray-50 hover:border-gray-200",
                            ].join(" ")}
                        >
                            <div className="font-semibold">{t.label}</div>
                            {t.description ? (
                                <div className={["text-sm mt-0.5", isActive ? "text-gray-200" : "text-gray-500"].join(" ")}>
                                    {t.description}
                                </div>
                            ) : null}
                        </button>
                    );
                })}
            </nav>

            <div className="px-4 pb-3 pt-2 text-xs text-gray-500">
                Astuce: les onglets visités restent “en mémoire” (pas de remount).
            </div>
        </div>
    );
};
