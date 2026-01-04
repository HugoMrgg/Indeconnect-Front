import React from "react";
import { useTranslation } from 'react-i18next';

export const ProfileTab: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="p-6 space-y-6">
            <header>
                <h2 className="text-xl font-bold text-gray-900">{t('pages.settings.profile.title')}</h2>
                <p className="text-gray-500 mt-1">{t('pages.settings.profile.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-500">{t('pages.settings.profile.name.label')}</div>
                    <div className="font-semibold text-gray-900 mt-1">—</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-500">{t('pages.settings.profile.email.label')}</div>
                    <div className="font-semibold text-gray-900 mt-1">—</div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border rounded-lg text-sm text-gray-600">
                {t('pages.settings.profile.placeholder')}
            </div>
        </div>
    );
};
