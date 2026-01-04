// @/features/admin/InviteAccountModal.tsx
import { useEffect, useRef, useCallback } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useInviteAccount } from "@/hooks/Auth/useInviteAccount";
import { InviteAccountForm } from "./InviteAccountForm";
import { useAuth } from "@/hooks/Auth/useAuth";
import { Role } from "@/types/account";
import { useTranslation } from "react-i18next";

interface InviteAccountModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteAccountModal({ onClose, onSuccess }: InviteAccountModalProps) {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const { invite, loading, error, success, validationErrors, formData, reset } = useInviteAccount(onSuccess);
    const { user } = useAuth();

    const handleSuccessClose = useCallback(() => {
        reset();
        onSuccess();
    }, [reset, onSuccess]);

    // Focus trap et gestion du clavier
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                if (success) {
                    handleSuccessClose();
                } else {
                    onClose();
                }
            }
        };

        closeButtonRef.current?.focus();

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose, loading, success, handleSuccessClose]);

    // Empêcher le scroll du body
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    const getSuccessMessage = () => {
        if (formData?.targetRole === "SuperVendor") {
            return {
                title: t('admin.invite.supervendor_created'),
                description: t('admin.invite.supervendor_message')
            };
        }

        return {
            title: t('admin.invite.invitation_sent'),
            description: t('admin.invite.invitation_message')
        };
    };

    const successMessage = getSuccessMessage();

    if (success) {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="success-title"
            >
                <div
                    ref={modalRef}
                    className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
                    role="alertdialog"
                >
                    <div className="flex items-center gap-3 text-green-600 mb-4">
                        <CheckCircle size={24} aria-hidden="true" />
                        <h2 id="success-title" className="text-xl font-bold">
                            {successMessage.title}
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-6" role="status" aria-live="polite">
                        {successMessage.description}
                    </p>

                    {formData?.targetRole === "SuperVendor" && (
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-sm text-blue-700">
                                {t('brands.vendor.no_empty_brand')}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleSuccessClose}
                        className="w-full mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }

    // Si pas d'utilisateur connecté, afficher erreur
    if (!user) {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
            >
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <AlertCircle size={24} aria-hidden="true" />
                        <h2 className="text-xl font-bold">{t('auth.login.google_error')}</h2>
                    </div>
                    <p className="text-gray-600 mb-6">{t('auth.login.relogin_prompt')}</p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 id="modal-title" className="text-2xl font-bold">
                        {t('admin.accounts.invite_button')}
                    </h2>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded-lg p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={t('common.close')}
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>

                <InviteAccountForm
                    onSubmit={invite}
                    onCancel={onClose}
                    loading={loading}
                    error={error}
                    validationErrors={validationErrors}
                    currentRole={user.role as Role}
                />
            </div>
        </div>
    );
}
