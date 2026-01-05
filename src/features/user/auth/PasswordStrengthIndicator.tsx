import { useMemo } from "react";
import { getPasswordCriteria } from "@/utils/passwordValidation";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PasswordStrengthIndicatorProps {
    password: string;
    show: boolean;
}

export function PasswordStrengthIndicator({ password, show }: PasswordStrengthIndicatorProps) {
    const { t } = useTranslation();

    const criteria = useMemo(() => getPasswordCriteria(password), [password]);

    const validCount = Object.values(criteria).filter(Boolean).length;
    const strengthPercentage = (validCount / 5) * 100;

    const getStrengthColor = () => {
        if (validCount === 5) return "bg-green-500";
        if (validCount >= 4) return "bg-yellow-500";
        if (validCount >= 3) return "bg-orange-500";
        return "bg-red-500";
    };

    const getStrengthLabel = () => {
        if (validCount === 5) return t('auth.password_strength.strong');
        if (validCount >= 4) return t('auth.password_strength.good');
        if (validCount >= 3) return t('auth.password_strength.fair');
        return t('auth.password_strength.weak');
    };

    if (!show || !password) return null;

    return (
        <div className="mt-3 space-y-2">
            {/* Barre de progression */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${strengthPercentage}%` }}
                    />
                </div>
                <span className={`text-xs font-medium ${
                    validCount === 5 ? 'text-green-600' :
                        validCount >= 4 ? 'text-yellow-600' :
                            validCount >= 3 ? 'text-orange-600' :
                                'text-red-600'
                }`}>
                    {getStrengthLabel()}
                </span>
            </div>

            {/* Liste des critères */}
            <div className="space-y-1 text-xs">
                <CriteriaItem
                    valid={criteria.minLength}
                    label={t('auth.password_criteria.min_length')}
                />
                <CriteriaItem
                    valid={criteria.hasLowercase}
                    label={t('auth.password_criteria.lowercase')}
                />
                <CriteriaItem
                    valid={criteria.hasUppercase}
                    label={t('auth.password_criteria.uppercase')}
                />
                <CriteriaItem
                    valid={criteria.hasDigit}
                    label={t('auth.password_criteria.digit')}
                />
                <CriteriaItem
                    valid={criteria.hasSpecialChar}
                    label={t('auth.password_criteria.special_char')}
                />
            </div>
        </div>
    );
}

function CriteriaItem({ valid, label }: { valid: boolean; label: string }) {
    return (
        <div className={`flex items-center gap-1.5 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
            {valid ? <Check size={14} /> : <X size={14} />}
            <span>{label}</span>
        </div>
    );
}