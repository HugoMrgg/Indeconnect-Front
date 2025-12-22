/*
import React, { useMemo, useState } from "react";
import { SettingsNav, type TabKey, type TabItem } from "./SettingsNav";
import {ProfileTab} from "@/pages/settings/ProfileTab";
import {PaymentMethodsTab} from "@/pages/settings/PaymentMethodsTab";
import {SecurityTab} from "@/pages/settings/SecurityTab";
import {NotificationsTab} from "@/pages/settings/NotificationsTab";

export const SettingsPage: React.FC = () => {
    const tabs: TabItem[] = useMemo(
        () => [
            { key: "profile", label: "Mes informations", description: "Profil, facturation, identité", element: <ProfileTab /> },
            { key: "payments", label: "Moyens de paiement", description: "Cartes et méthode par défaut", element: <PaymentMethodsTab /> },
            { key: "security", label: "Sécurité", description: "Mot de passe, 2FA, sessions", element: <SecurityTab /> },
            { key: "notifications", label: "Notifications", description: "Emails, push, préférences", element: <NotificationsTab /> },
        ],
        []
    );

    const [active, setActive] = useState<TabKey>("profile");

    // Keep-alive: on ne monte une tab qu'à la 1ère visite, puis on la garde montée
    const [mounted, setMounted] = useState<Record<TabKey, boolean>>({
        profile: true,
        payments: false,
        security: false,
        notifications: false,
    });

    const handleChangeTab = (key: TabKey) => {
        setActive(key);
        setMounted((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                    <aside className="lg:sticky lg:top-6 h-fit">
                        <SettingsNav tabs={tabs} active={active} onChange={handleChangeTab} />
                    </aside>

                    <main className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        {/!* On rend les panels visités seulement, et on les cache sans les démonter *!/}
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
                    </main>
                </div>
            </div>
        </div>
    );
};
*/
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { SettingsPageLayout } from "@/features/settings/SettingsPageLayout";


import { userStorage } from "@/storage/UserStorage";

import React, { useMemo, useState } from "react";
import {ProfileTab} from "@/pages/settings/ProfileTab";
import {PaymentMethodsTab} from "@/pages/settings/PaymentMethodsTab";
import {SecurityTab} from "@/pages/settings/SecurityTab";
import {NotificationsTab} from "@/pages/settings/NotificationsTab";
import {TabItem, TabKey} from "@/pages/settings/SettingsNav";
import {SettingsContent, SettingsSearchItem} from "@/features/settings/SettingsContent";

export function SettingsPage() {
    const navigate = useNavigate();
    const { tab } = useParams<{ tab?: string }>();

    // 🔥 BARRE DE RECHERCHE (même structure que Wishlist)
    const [searchQuery, setSearchQuery] = useState<string>("");

    // 🔥 User
    const user = userStorage.getUser();
    if (user === null) {
        toast.error("Connecte-toi pour accéder aux paramètres 🔧");
        navigate("/");
    }

    const tabs: TabItem[] = useMemo(
        () => [
            { key: "profile", label: "Mes informations", description: "Profil, identité, facturation", element: <ProfileTab /> },
            { key: "payments", label: "Moyens de paiement", description: "Cartes, défaut, suppression", element: <PaymentMethodsTab /> },
            { key: "security", label: "Sécurité", description: "Mot de passe, 2FA, sessions", element: <SecurityTab /> },
            { key: "notifications", label: "Notifications", description: "Emails, préférences", element: <NotificationsTab /> },
        ],
        []
    );

    const safeTab = (value?: string): TabKey => {
        const allowed: TabKey[] = ["profile", "payments", "security", "notifications"];
        return allowed.includes(value as TabKey) ? (value as TabKey) : "profile";
    };

    const [active, setActive] = useState<TabKey>(() => safeTab(tab));

    // ✅ keep-alive (les tabs restent montées après 1ère visite)
    const [mounted, setMounted] = useState<Record<TabKey, boolean>>({
        profile: true,
        payments: false,
        security: false,
        notifications: false,
    });

    // synchro URL -> état
    React.useEffect(() => {
        const next = safeTab(tab);
        setActive(next);
        setMounted((prev) => (prev[next] ? prev : { ...prev, [next]: true }));
    }, [tab]);

    const handleChangeTab = (key: TabKey) => {
        setActive(key);
        setMounted((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

        // URL propre
        navigate(key === "profile" ? "/settings" : `/settings/${key}`);
    };

    // ✅ index de recherche (moteur simple, efficace, extensible)
    const searchIndex: SettingsSearchItem[] = useMemo(
        () => [
            {
                id: "profile-name",
                tab: "profile",
                title: "Nom / Prénom",
                description: "Modifier tes informations personnelles",
                keywords: ["profil", "nom", "prénom", "identité", "coordonnées", "facturation"],
            },
            {
                id: "payments-add-card",
                tab: "payments",
                title: "Ajouter une carte",
                description: "Enregistrer une nouvelle carte bancaire",
                keywords: ["paiement", "carte", "visa", "mastercard", "banque", "ajouter"],
            },
            {
                id: "payments-default",
                tab: "payments",
                title: "Carte par défaut",
                description: "Définir une carte pour les futurs achats",
                keywords: ["paiement", "par défaut", "default", "carte", "checkout"],
            },
            {
                id: "security-password",
                tab: "security",
                title: "Changer de mot de passe",
                description: "Mettre à jour ton mot de passe",
                keywords: ["sécurité", "mot de passe", "password", "reset"],
            },
            {
                id: "security-2fa",
                tab: "security",
                title: "Activer le 2FA",
                description: "Sécuriser le compte avec double authentification",
                keywords: ["2fa", "double authentification", "otp", "sécurité", "auth"],
            },
            {
                id: "notifications-email",
                tab: "notifications",
                title: "Notifications email",
                description: "Gérer emails marketing et sécurité",
                keywords: ["notifications", "email", "marketing", "alertes"],
            },
        ],
        []
    );

    const goToResult = (item: SettingsSearchItem) => {
        handleChangeTab(item.tab);

        // Optionnel : scroll vers section si le bloc id existe dans l’onglet
        setTimeout(() => {
            const el = document.getElementById(item.id);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
    };

    return (
        <SettingsPageLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-600 mt-1">Gérer ici vos paramètres et préférences.</p>
                </header>

                <SettingsContent
                    tabs={tabs}
                    active={active}
                    mounted={mounted}
                    onChangeTab={handleChangeTab}
                    searchQuery={searchQuery}
                    searchIndex={searchIndex}
                    onGoToResult={goToResult}
                />
            </div>
        </SettingsPageLayout>
    );
}
