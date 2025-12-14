import React from "react";

export const ProfileTab: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <header>
                <h2 className="text-xl font-bold text-gray-900">Mes informations</h2>
                <p className="text-gray-500 mt-1">Infos de compte, coordonnées, facturation…</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="font-semibold text-gray-900 mt-1">—</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold text-gray-900 mt-1">—</div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border rounded-lg text-sm text-gray-600">
                Ici tu branches ton hook “profile” plus tard. Pour l’instant c’est un châssis propre.
            </div>
        </div>
    );
};
