import { useEffect, useRef } from "react";
import { X, CheckCircle } from "lucide-react";
import { useInviteAccount } from "@/hooks/useInviteAccount";
import { InviteAccountForm } from "./InviteAccountForm";

interface InviteAccountModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteAccountModal({ onClose, onSuccess }: InviteAccountModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const { invite, loading, error, success, validationErrors } = useInviteAccount(onSuccess);

    // Focus trap et gestion du clavier
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                onClose();
            }
        };

        // Focus sur le premier élément interactif
        closeButtonRef.current?.focus();

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose, loading]);

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
                            Invitation envoyée !
                        </h2>
                    </div>
                    <p className="text-gray-600" role="status" aria-live="polite">
                        Un email d'activation a été envoyé. L'utilisateur pourra définir son mot de passe en cliquant sur le lien.
                    </p>
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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 id="modal-title" className="text-2xl font-bold">
                        Inviter un compte
                    </h2>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-black rounded-lg p-1"
                        aria-label="Fermer la modal"
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>

                {/* Form */}
                <InviteAccountForm
                    onSubmit={invite}
                    onCancel={onClose}
                    loading={loading}
                    error={error}
                    validationErrors={validationErrors}
                />
            </div>
        </div>
    );
}
