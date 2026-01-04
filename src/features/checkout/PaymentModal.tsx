import { X } from "lucide-react";
import { PaymentSection } from "./PaymentSection";
import { useTranslation } from 'react-i18next';

type PaymentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
    onPaymentSuccess: () => void;
};

export function PaymentModal({ isOpen, onClose, orderId, onPaymentSuccess }: PaymentModalProps) {
    const { t } = useTranslation();
    if (!isOpen || !orderId) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40"
                onClick={onClose}
            />

            {/* Modal container */}
            <div
                className="
                    absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl
                    overflow-hidden z-50
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('pages.checkout.finalizePayment')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={t('common.close')}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Body - PaymentSection */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
                    <PaymentSection orderId={orderId} onPaymentSuccess={onPaymentSuccess} />
                </div>
            </div>
        </div>
    );
}
