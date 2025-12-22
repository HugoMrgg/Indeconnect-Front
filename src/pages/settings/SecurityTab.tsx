import React from "react";

export const SecurityTab: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <header>
                <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
                <p className="text-gray-500 mt-1">Mot de passe, 2FA, appareils connectés.</p>
            </header>

            <div className="p-4 border rounded-lg">
                <div className="font-semibold">Authentification à deux facteurs</div>
                <p className="text-sm text-gray-500 mt-1">À brancher quand tu veux verrouiller ça comme un coffre.</p>
                <button className="mt-3 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
                    Activer le 2FA
                </button>
            </div>
        </div>
    );
};
