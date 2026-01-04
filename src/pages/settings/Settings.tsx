import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { SettingsPageLayout } from "@/features/settings/SettingsPageLayout";


import { userStorage } from "@/storage/UserStorage";

import React, { useMemo, useState } from "react";
import {ProfileTab} from "@/pages/settings/ProfileTab";
import {PaymentMethodsTab} from "@/pages/settings/PaymentMethodsTab";
import {NotificationsTab} from "@/pages/settings/NotificationsTab";
import {TabItem, TabKey} from "@/pages/settings/SettingsNav";
import {SettingsContent, SettingsSearchItem} from "@/features/settings/SettingsContent";
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { tab } = useParams<{ tab?: string }>();

    const [searchQuery, setSearchQuery] = useState<string>("");

    const user = userStorage.getUser();
    if (user === null) {
        toast.error(t('pages.settings.errors.notAuthenticated'));
        navigate("/");
    }

    const tabs: TabItem[] = useMemo(
        () => [
            { key: "profile", label: t('pages.settings.tabs.profile.label'), description: t('pages.settings.tabs.profile.description'), element: <ProfileTab /> },
            { key: "payments", label: t('pages.settings.tabs.payments.label'), description: t('pages.settings.tabs.payments.description'), element: <PaymentMethodsTab /> },
            { key: "notifications", label: t('pages.settings.tabs.notifications.label'), description: t('pages.settings.tabs.notifications.description'), element: <NotificationsTab /> },
        ],
        [t]
    );

    const safeTab = (value?: string): TabKey => {
        const allowed: TabKey[] = ["profile", "payments", "notifications"];
        return allowed.includes(value as TabKey) ? (value as TabKey) : "profile";
    };

    const [active, setActive] = useState<TabKey>(() => safeTab(tab));

    const [mounted, setMounted] = useState<Record<TabKey, boolean>>({
        profile: true,
        payments: false,
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

    const searchIndex: SettingsSearchItem[] = useMemo(
        () => [
            {
                id: "profile-name",
                tab: "profile",
                title: t('pages.settings.search.profileName.title'),
                description: t('pages.settings.search.profileName.description'),
                keywords: ["profil", "nom", "prénom", "identité", "coordonnées", "facturation"],
            },
            {
                id: "payments-add-card",
                tab: "payments",
                title: t('pages.settings.search.paymentsAddCard.title'),
                description: t('pages.settings.search.paymentsAddCard.description'),
                keywords: ["paiement", "carte", "visa", "mastercard", "banque", "ajouter"],
            },
            {
                id: "payments-default",
                tab: "payments",
                title: t('pages.settings.search.paymentsDefault.title'),
                description: t('pages.settings.search.paymentsDefault.description'),
                keywords: ["paiement", "par défaut", "default", "carte", "checkout"],
            },
            {
                id: "notifications-email",
                tab: "notifications",
                title: t('pages.settings.search.notificationsEmail.title'),
                description: t('pages.settings.search.notificationsEmail.description'),
                keywords: ["notifications", "email", "marketing", "alertes"],
            },
        ],
        [t]
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
                    <h1 className="text-3xl font-bold text-gray-900">{t('pages.settings.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('pages.settings.subtitle')}</p>
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
