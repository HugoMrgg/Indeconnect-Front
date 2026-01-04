import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createShippingAddress } from "@/api/services/shipping";
import { ShippingAddressDto } from "@/api/services/shipping/types";
import { extractErrorMessage } from "@/utils/errorHandling";
import toast from "react-hot-toast";
import { logger } from "@/utils/logger";

type Props = {
    userId: number;
    onSuccess: (address: ShippingAddressDto) => void;
    onCancel: () => void;
};

type FormErrors = {
    street?: string;
    number?: string;
    postalCode?: string;
    city?: string;
};

export function AddressForm({ userId, onSuccess, onCancel }: Props) {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        street: "",
        number: "",
        postalCode: "",
        city: "",
        country: "BE",
        extra: "",
        isDefault: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Validation du code postal belge (4 chiffres)
    const validatePostalCode = (code: string): boolean => {
        const belgianPostalCodeRegex = /^\d{4}$/;
        return belgianPostalCodeRegex.test(code);
    };

    // Validation du formulaire
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (formData.street.trim().length < 2) {
            newErrors.street = t('checkout.address.street_error');
        }

        if (!formData.number.trim()) {
            newErrors.number = t('checkout.address.number_error');
        }

        if (!validatePostalCode(formData.postalCode)) {
            newErrors.postalCode = t('checkout.address.postal_code_error');
        }

        if (formData.city.trim().length < 2) {
            newErrors.city = t('checkout.address.city_error');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Désactivation du bouton si formulaire invalide
    const isFormValid = useMemo(() => {
        return (
            formData.street.trim().length >= 2 &&
            formData.number.trim().length > 0 &&
            validatePostalCode(formData.postalCode) &&
            formData.city.trim().length >= 2
        );
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error(t('checkout.address.form_errors'));
            return;
        }

        setLoading(true);

        try {
            const newAddress = await createShippingAddress(userId, formData);
            toast.success(t('checkout.address.added_success'));
            onSuccess(newAddress);
        } catch (error: unknown) {
            logger.error("AddressForm.handleSubmit", error);
            toast.error(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Rue */}
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkout.address.street_label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => {
                            setFormData({ ...formData, street: e.target.value });
                            if (errors.street) setErrors({ ...errors, street: undefined });
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.street ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t('checkout.address.street_placeholder')}
                    />
                    {errors.street && (
                        <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                    )}
                </div>

                {/* Numéro */}
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkout.address.number_label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.number}
                        onChange={(e) => {
                            setFormData({ ...formData, number: e.target.value });
                            if (errors.number) setErrors({ ...errors, number: undefined });
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.number ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t('checkout.address.number_placeholder')}
                    />
                    {errors.number && (
                        <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                    )}
                </div>

                {/* Code postal */}
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkout.address.postal_code_label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={4}
                        value={formData.postalCode}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, postalCode: value });
                            if (errors.postalCode) setErrors({ ...errors, postalCode: undefined });
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.postalCode ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t('checkout.address.postal_code_placeholder')}
                    />
                    {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                    )}
                </div>

                {/* Ville */}
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkout.address.city_label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (errors.city) setErrors({ ...errors, city: undefined });
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t('checkout.address.city_placeholder')}
                    />
                    {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                </div>

                {/* Complément d'adresse */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkout.address.complement_label')}
                    </label>
                    <input
                        type="text"
                        value={formData.extra}
                        onChange={(e) => setFormData({ ...formData, extra: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('checkout.address.complement_placeholder')}
                    />
                </div>

                {/* Checkbox par défaut */}
                <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                            {t('checkout.address.set_default')}
                        </span>
                    </label>
                </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? t('checkout.address.adding') : t('checkout.address.add_button')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                    {t('common.cancel')}
                </button>
            </div>
        </form>
    );
}