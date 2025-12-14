import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { InviteAccountModal } from "@/features/admin/InviteAccountModal";
import { AccountsTable } from "@/features/admin/AccountsTable";
import { useAccounts } from "@/hooks/Auth/useAccounts";
import type { InviteAccountRequest } from "@/types/account";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

export function AccountsManagement() {
    // 🔥 BARRE DE RECHERCHE (comme Wishlist)
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [openModal, setOpenModal] = useState(false);
    const { accounts, loading, error, refetch, toggleStatus, resendInvitation } = useAccounts();

    const handleInviteSuccess = () => {
        setOpenModal(false);
        refetch();
    };

    const handleToggleStatus = async (accountId: number, currentStatus: boolean): Promise<void> => {
        try {
            await toggleStatus(accountId, currentStatus);
        } catch (err) {
            console.error("Failed to toggle account status:", err);
        }
    };

    const handleResendInvitation = async (data: InviteAccountRequest): Promise<void> => {
        try {
            await resendInvitation(data);
        } catch (err) {
            console.error("Failed to resend invitation:", err);
        }
    };

    // FILTRAGE TEXTE (comme pour les marques / wishlist)
    const filteredAccounts = useMemo(() => {
        if (!accounts) return [];

        const q = searchQuery.trim().toLowerCase();
        if (!q) return accounts;

        return accounts.filter((a: any) => {
            // adapte si tes props sont typées différemment
            const fullName =
                `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() ||
                a.name ||
                "";

            const email = a.email ?? "";
            const username = a.username ?? "";
            const company = a.company ?? a.companyName ?? "";
            const roles = Array.isArray(a.roles) ? a.roles.join(" ") : (a.role ?? "");
            const status = typeof a.isActive === "boolean" ? (a.isActive ? "actif active enabled" : "inactif disabled") : "";

            const haystack = `${fullName} ${email} ${username} ${company} ${roles} ${status}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [accounts, searchQuery]);

    const isSearching = searchQuery.trim().length > 0;

    return (
        <main className="relative bg-white min-h-screen mx-auto pb-16">
            {/* Hero Banner */}
            <section className="bg-[#C9B38C] px-6 py-16 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-start gap-6">
                        <div>
                            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                                Gestion des Comptes
                            </h1>
                            <div className="w-24 h-1 bg-gray-900 mb-6" aria-hidden="true"></div>
                            <p className="text-gray-700 text-lg">
                                Créer et gérer les comptes administrateur, modérateur et supervendeur
                            </p>

                            {isSearching && !loading ? (
                                <p className="mt-4 text-sm text-gray-800">
                                    Résultats pour <span className="font-semibold">“{searchQuery}”</span> :{" "}
                                    <span className="font-semibold">{filteredAccounts.length}</span>
                                </p>
                            ) : null}
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
                        <>
                            {/* ✅ No results */}
                            {filteredAccounts.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-700 font-semibold">Aucun compte ne correspond.</p>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        Essaie un email, un nom, ou un rôle (ex: “administrator”, “moderator”, “supervendor”).
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                    <AccountsTable
                                        accounts={filteredAccounts}
                                        onToggleStatus={handleToggleStatus}
                                        onResendInvitation={handleResendInvitation}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <AuthPanel />
            {/* branché comme Wishlist */}
            <NavBar scope={"accounts"} searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </main>
    );
}
