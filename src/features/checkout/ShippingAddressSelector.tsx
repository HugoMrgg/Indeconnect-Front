import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, MapPin, Check, Loader2 } from "lucide-react";
import { useShipping } from "@/hooks/Order/useShipping";
import { AddressForm } from "./AddressForm";

type Props = {
    userId: number;
    selectedAddressId: number | null;
    onSelectAddress: (addressId: number | null) => void;
};

export function ShippingAddressSelector({ userId, selectedAddressId, onSelectAddress }: Props) {
    const { t } = useTranslation();
    const { addresses, loading, fetchAddresses } = useShipping();
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchAddresses(userId).then((data) => {
            // Auto-sélectionner l'adresse par défaut
            if (data && !selectedAddressId) {
                const defaultAddr = data.find(a => a.isDefault);
                if (defaultAddr) {
                    onSelectAddress(defaultAddr.id);
                }
            }
        });
    }, [userId, selectedAddressId, onSelectAddress, fetchAddresses]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{t('common.loading')}</h2>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t('common.loading')}</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    {showAddForm ? t('common.cancel') : t('common.add')}
                </button>
            </div>

            {showAddForm && (
                <div className="mb-4 border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <AddressForm
                        userId={userId}
                        onSuccess={(newAddress) => {
                            onSelectAddress(newAddress.id);
                            setShowAddForm(false);
                            fetchAddresses(userId); // Recharger la liste
                        }}
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            )}

            <div className="space-y-3">
                {addresses.length === 0 ? (
                    <div className="text-center py-8">
                        <MapPin className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600 font-medium mb-1">{t('common.loading')}</p>
                        <p className="text-gray-500 text-sm mb-4">
                            {t('common.loading')}
                        </p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} />
                            {t('common.add')}
                        </button>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <button
                            key={address.id}
                            onClick={() => onSelectAddress(address.id)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedAddressId === address.id
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        size={20}
                                        className={`flex-shrink-0 mt-0.5 ${
                                            selectedAddressId === address.id
                                                ? "text-blue-600"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {address.street}, {address.number}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {address.postalCode} {address.city}
                                        </p>
                                        {address.extra && (
                                            <p className="text-sm text-gray-500 mt-1">{address.extra}</p>
                                        )}
                                        {address.isDefault && (
                                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded font-medium">
                                                Par défaut
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {selectedAddressId === address.id && (
                                    <Check size={20} className="text-blue-600 flex-shrink-0" />
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}