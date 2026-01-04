// src/features/cart/CartModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export const CartModal = ({
                              open,
                              onClose,
                              children,
                          }: {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}) => {
    const { t } = useTranslation();
    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`
                    fixed top-0 right-0 bottom-0 z-50 bg-white shadow-2xl rounded-l-3xl
                    w-[420px] max-w-[95vw]
                    h-full flex flex-col
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-[120%]"}
                `}
                style={{ pointerEvents: open ? "auto" : "none" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-lg">{t('cart.title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-5">{children}</div>
            </div>
        </>
    );
};
