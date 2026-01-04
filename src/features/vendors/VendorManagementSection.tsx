import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { InviteAccountModal } from "@/features/admin/InviteAccountModal";
import { AccountsTable } from "@/features/admin/AccountsTable";
import { useAccounts } from "@/hooks/Auth/useAccounts";
import type { InviteAccountRequest } from "@/types/account";
import { AccountTableSkeleton } from "@/components/skeletons";
import { logger } from "@/utils/logger";
import { useTranslation } from 'react-i18next';

interface VendorManagementSectionProps {
    brandId: number;
}

export function VendorManagementSection({ brandId }: VendorManagementSectionProps) {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Réutilise le hook existant - le backend filtre automatiquement pour SuperVendor
    const { accounts, loading, error, refetch, toggleStatus, resendInvitation } = useAccounts();

    const handleInviteSuccess = () => {
        setOpenModal(false);
        refetch();
    };

    const handleToggleStatus = async (accountId: number, currentStatus: boolean): Promise<void> => {
        try {
            await toggleStatus(accountId, currentStatus);
        } catch (err) {
            logger.error("VendorManagementSection.handleToggleStatus", err);
        }
    };

    const handleResendInvitation = async (data: InviteAccountRequest): Promise<void> => {
        try {
            await resendInvitation(data);
        } catch (err) {
            logger.error("VendorManagementSection.handleResendInvitation", err);
        }
    };

    // Filtrage local des Vendors uniquement
    const vendors = useMemo(() => {
        return accounts.filter(account => account.role === "Vendor");
    }, [accounts]);

    // Filtrage par recherche
    const filteredVendors = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return vendors;

        return vendors.filter((v) => {
            const fullName = `${v.firstName ?? ""} ${v.lastName ?? ""}`.trim();
            const email = v.email ?? "";
            const status = v.isEnabled ? "actif active enabled" : "inactif disabled";

            const haystack = `${fullName} ${email} ${status}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [vendors, searchQuery]);

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {t('features.vendors.title')}
                            </h2>
                            <p className="text-gray-600">
                                {t('features.vendors.subtitle', { count: vendors.length })}
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenModal(true)}
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg"
                            aria-label={t('features.vendors.inviteAria')}
                        >
                            <Plus size={20} aria-hidden="true" />
                            {t('features.vendors.inviteButton')}
                        </button>
                    </div>

                    {/* Barre de recherche */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('features.vendors.searchPlaceholder') as string}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                        />
                    </div>

                    {/* Modal d'invitation */}
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

                    {/* Loading State */}
                    {loading ? (
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                            <AccountTableSkeleton rows={3} />
                        </div>
                    ) : (
                        <>
                            {filteredVendors.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-700 font-semibold">
                                        {searchQuery ? t('features.vendors.noMatch') : t('features.vendors.noVendors')}
                                    </p>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        {searchQuery
                                            ? t('features.vendors.tryAnother')
                                            : t('features.vendors.inviteFirst')}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                                    <AccountsTable
                                        accounts={filteredVendors}
                                        onToggleStatus={handleToggleStatus}
                                        onResendInvitation={handleResendInvitation}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}