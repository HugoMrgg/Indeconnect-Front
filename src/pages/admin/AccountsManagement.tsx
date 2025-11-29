// @/pages/admin/AccountsManagement.tsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { InviteAccountModal } from "@/features/admin/InviteAccountModal";
import { AccountsTable } from "@/features/admin/AccountsTable";
import { useAccounts } from "@/hooks/useAccounts";

export function AccountsManagement() {
    const [openModal, setOpenModal] = useState(false);
    const { accounts, loading, error, refetch, toggleStatus } = useAccounts();

    const handleInviteSuccess = () => {
        setOpenModal(false);
        refetch();
    };

    const handleToggleStatus = async (accountId: number, currentStatus: boolean): Promise<void> => {
        try {
            await toggleStatus(accountId, currentStatus);
        } catch (err) {
            // Error already handled in hook, just log for debugging
            console.error("Failed to toggle account status:", err);
        }
    };

    return (
        <main className="relative bg-white min-h-screen mx-auto pb-16">
            {/* Hero Banner */}
            <section className="bg-[#C9B38C] px-6 py-16 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                                Gestion des Comptes
                            </h1>
                            <div className="w-24 h-1 bg-gray-900 mb-6" aria-hidden="true"></div>
                            <p className="text-gray-700 text-lg">
                                Créer et gérer les comptes administrateur, modérateur et supervendeur
                            </p>
                        </div>
                        <button
                            onClick={() => setOpenModal(true)}
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg"
                            aria-label="Ouvrir le formulaire d'invitation de compte"
                        >
                            <Plus size={20} aria-hidden="true" />
                            Inviter un compte
                        </button>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="my-10 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Modal */}
                    {openModal && (
                        <InviteAccountModal
                            onClose={() => setOpenModal(false)}
                            onSuccess={handleInviteSuccess}
                        />
                    )}

                    {/* Error Alert */}
                    {error && (
                        <div
                            role="alert"
                            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </div>
                    )}

                    {/* Section Title */}
                    <h2 className="text-xl font-semibold mb-4">Tous les comptes :</h2>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center mt-12">
                            <p className="text-gray-500 animate-pulse">Chargement des comptes...</p>
                        </div>
                    ) : (
                        /* Accounts Table Card */
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                            <AccountsTable
                                accounts={accounts}
                                onToggleStatus={handleToggleStatus}
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
