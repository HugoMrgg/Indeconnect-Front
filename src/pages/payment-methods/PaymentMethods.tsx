import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

import { PaymentMethodDto } from "@/api/services/payments-methods/types";
import { usePaymentMethods } from "@/hooks/Settings/usePaymentsMethods";
import {AddPaymentMethodModal} from "@/features/settings/Payment-Settings/AddPaymentMethodModal";
import {ConfirmDialog} from "@/components/ui/ConfirmDialog";

const BrandBadge = ({ brand }: { brand: string }) => {
    const label = (brand || "card").toUpperCase();

    return (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold tracking-wide max-w-[96px] truncate">
      {label}
    </span>
    );
};


export const PaymentMethodsPage: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading, actingId, error, removePaymentMethod, setDefaultMethod, refetch } = usePaymentMethods();
    const [openAdd, setOpenAdd] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState<PaymentMethodDto | null>(null);
    const [deleting, setDeleting] = useState(false);

    const askDelete = (m: PaymentMethodDto) => {
        setToDelete(m);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!toDelete) return;

        setDeleting(true);
        try {
            await removePaymentMethod(toDelete.id);
            toast.success(t('pages.paymentMethods.deleted'));
            setConfirmOpen(false);
            setToDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const makeDefault = async (m: PaymentMethodDto) => {
        await setDefaultMethod(m.id);
        toast.success(t('pages.paymentMethods.setDefault'));
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">{t('pages.paymentMethods.loading')}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <header id="payments-default" className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('pages.paymentMethods.title')}</h2>
                    <p className="text-gray-600 mt-1">{t('pages.paymentMethods.subtitle')}</p>
                </div>

                <button
                    type="button"
                    onClick={() => setOpenAdd(true)}
                    className="shrink-0 px-4 py-2 rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition"
                >
                    {t('pages.paymentMethods.addButton')}
                </button>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {data.map((m) => (
                    <div
                        key={m.id}
                        className={`flex items-start justify-between p-4 border rounded-lg bg-white ${
                            m.isDefault ? "border-blue-500 ring-1 ring-blue-500 shadow-sm" : "border-gray-200"
                        }`}
                    >
                        <div className="flex gap-4">
                            <div className="w-20 shrink-0 flex items-center">
                                <BrandBadge brand={m.brand} />
                            </div>

                            <div>
                                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 font-mono">
                    {m.type === "card" ? `•••• ${m.last4 ?? "----"}` : m.type.toUpperCase()}
                  </span>

                                    {m.isDefault && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {t('pages.paymentMethods.defaultBadge')}
                    </span>
                                    )}
                                </div>

                                <div className="text-sm text-gray-500 mt-1">
                                    {m.type === "card" ? (
                                        <>
                                            {t('pages.paymentMethods.expiresOn')} {(m.expiryMonth ?? 0).toString().padStart(2, "0")}/{m.expiryYear ?? "--"}
                                        </>
                                    ) : (
                                        <>{t('pages.paymentMethods.method')} {m.type}</>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 ml-4">
                            {!m.isDefault && (
                                <button
                                    onClick={() => makeDefault(m)}
                                    disabled={actingId === m.id}
                                    className="text-sm text-gray-600 hover:text-blue-600 px-2 py-1 disabled:opacity-50"
                                >
                                    {t('pages.paymentMethods.setAsDefaultButton')}
                                </button>
                            )}

                            <button
                                onClick={() => askDelete(m)}
                                disabled={actingId === m.id}
                                className="text-sm text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded disabled:opacity-50"
                            >
                                {t('pages.paymentMethods.deleteButton')}
                            </button>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">{t('pages.paymentMethods.empty')}</p>
                        <button
                            type="button"
                            onClick={() => setOpenAdd(true)}
                            className="mt-4 px-5 py-2 rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition"
                        >
                            {t('pages.paymentMethods.addCardButton')}
                        </button>
                    </div>
                )}
            </div>

            <AddPaymentMethodModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onAdded={refetch}
            />

            <ConfirmDialog
                open={confirmOpen}
                title={t('pages.paymentMethods.confirmDeleteTitle')}
                message={
                    <div className="space-y-2">
                        <p>
                            {t('pages.paymentMethods.confirmDeleteMessagePrefix')}{" "}
                            <span className="font-mono font-semibold text-gray-900">
                                {toDelete?.type === "card" ? `•••• ${toDelete?.last4 ?? "----"}` : (toDelete?.type ?? "").toUpperCase()}
                            </span>.
                        </p>

                        {toDelete?.isDefault && (
                            <p className="text-red-700 bg-red-50 border border-red-100 rounded-lg p-2">
                                {t('pages.paymentMethods.confirmDeleteWarning')}
                            </p>
                        )}
                    </div>
                }
                confirmLabel={t('pages.paymentMethods.confirm')}
                cancelLabel={t('pages.paymentMethods.cancel')}
                danger
                loading={deleting}
                onCancel={() => {
                    if (deleting) return;
                    setConfirmOpen(false);
                    setToDelete(null);
                }}
                onConfirm={confirmDelete}
            />

        </div>
    );
};
