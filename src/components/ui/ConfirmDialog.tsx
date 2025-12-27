import React, { useEffect } from "react";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                                open,
                                                                title,
                                                                message,
                                                                confirmLabel = "Confirmer",
                                                                cancelLabel = "Annuler",
                                                                danger = false,
                                                                loading = false,
                                                                onConfirm,
                                                                onCancel,
                                                            }) => {
    // ESC pour fermer
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Close"
                onClick={onCancel}
            />

            {/* Container */}
            <div className="relative h-full w-full flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <div className="mt-2 text-sm text-gray-600">{message}</div>
                    </div>

                    <div className="px-6 pb-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={[
                                "px-4 py-2 rounded-lg text-white disabled:opacity-50",
                                danger ? "bg-red-600 hover:bg-red-700" : "bg-gray-900 hover:bg-gray-800",
                            ].join(" ")}
                        >
                            {loading ? "..." : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
