import React from "react";

export const NotificationsTab: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <header>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-500 mt-1">Emails, alertes, préférences.</p>
            </header>

            <div className="p-4 border rounded-lg space-y-3">
                <label className="flex items-center justify-between gap-4">
                    <span className="text-gray-900 font-medium">Emails marketing</span>
                    <input type="checkbox" className="h-5 w-5" />
                </label>
                <label className="flex items-center justify-between gap-4">
                    <span className="text-gray-900 font-medium">Alertes de sécurité</span>
                    <input type="checkbox" className="h-5 w-5" defaultChecked />
                </label>
            </div>
        </div>
    );
};
