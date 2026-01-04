import React, {useEffect, useMemo, useState} from "react";
import { Plus } from "lucide-react";
import { InviteAccountModal } from "@/features/admin/InviteAccountModal";
import { AccountsTable } from "@/features/admin/AccountsTable";
import { useAccounts } from "@/hooks/Auth/useAccounts";
import type { InviteAccountRequest } from "@/types/account";
import type { Account } from "@/api/services/account/types";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";
import { AccountTableSkeleton } from "@/components/skeletons";
import { logger } from "@/utils/logger";
import { useTranslation } from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";

export function AccountsManagement() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();
    const nav = useNavigate();
    
    const { accounts, loading, error, refetch, toggleStatus, resendInvitation } = useAccounts();

    const handleInviteSuccess = () => {
        setOpenModal(false);
        refetch();
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const shouldOpen = params.get("invite") === "1";

        if (shouldOpen) {
            setOpenModal(true);

            // optionnel : nettoyer l’URL après ouverture (évite réouverture au refresh)
            params.delete("invite");
            nav({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
        }
    }, [location.pathname, location.search, nav]);

    const handleToggleStatus = async (accountId: number, currentStatus: boolean): Promise<void> => {
        try {
            await toggleStatus(accountId, currentStatus);
        } catch (err) {
            logger.error("AccountsManagement.handleToggleStatus", err);
        }
    };

    const handleResendInvitation = async (data: InviteAccountRequest): Promise<void> => {
        try {
            await resendInvitation(data);
        } catch (err) {
            logger.error("AccountsManagement.handleResendInvitation", err);
        }
    };

    // FILTRAGE TEXTE (comme pour les marques / wishlist)
    const filteredAccounts = useMemo(() => {
        if (!accounts) return [];

        const q = searchQuery.trim().toLowerCase();
        if (!q) return accounts;

        return accounts.filter((a: Account) => {
            // Filter accounts based on search query
            const fullName = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
            const email = a.email ?? "";
            const role = a.role ?? "";
            const status = typeof a.isEnabled === "boolean" ? (a.isEnabled ? "actif active enabled" : "inactif disabled") : "";

            const haystack = `${fullName} ${email} ${role} ${status}`.toLowerCase();
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
                                {t('admin.accounts.title')}
                            </h1>
                            <div className="w-24 h-1 bg-gray-900 mb-6" aria-hidden="true"></div>
                            <p className="text-gray-700 text-lg">
                                Créer et gérer les comptes administrateur, modérateur et supervendeur
                            </p>

                            {isSearching && !loading ? (
                                <p className="mt-4 text-sm text-gray-800">
                                    Résultats pour <span className="font-semibold">"{searchQuery}"</span> :{" "}
                                    <span className="font-semibold">{filteredAccounts.length}</span>
                                </p>
                            ) : null}
                        </div>

                        <button
                            onClick={() => setOpenModal(true)}
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg"
                            aria-label={t('admin.accounts.invite_button')}
                        >
                            <Plus size={20} aria-hidden="true" />
                            {t('admin.accounts.invite_button')}
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
                    <h2 className="text-xl font-semibold mb-4">{t('brands.all_brands')}</h2>

                    {/* Loading State */}
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                            <AccountTableSkeleton rows={5} />
                        </div>
                    ) : (
                        <>
                            {filteredAccounts.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-700 font-semibold">{t('admin.accounts.no_accounts')}</p>
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
