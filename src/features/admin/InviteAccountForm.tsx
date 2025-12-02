// @/features/admin/InviteAccountForm.tsx
import { useState, useId, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Role } from "@/types/account";
import { getInvitableRoles } from "@/utils/roleHierarchy";
import type { InvitableRole, InviteAccountRequest } from "@/types/account";

interface InviteAccountFormProps {
    onSubmit: (data: InviteAccountRequest) => void;
    onCancel: () => void;
    loading: boolean;
    error: string | null;
    validationErrors?: {
        email?: string;
        firstName?: string;
        lastName?: string;
    };
    currentRole: Role; // ✅ Nouveau prop
}

export function InviteAccountForm({
                                      onSubmit,
                                      onCancel,
                                      loading,
                                      error,
                                      validationErrors = {},
                                      currentRole // ✅ Récupéré
                                  }: InviteAccountFormProps) {
    // ✅ Calculer les rôles invitables
    const invitableRoles = useMemo(() => getInvitableRoles(currentRole), [currentRole]);

    // ✅ Initialiser avec le premier rôle disponible
    const defaultRole = invitableRoles[0] as InvitableRole;

    const [formData, setFormData] = useState<InviteAccountRequest>({
        email: "",
        firstName: "",
        lastName: "",
        targetRole: defaultRole
    });

    const formId = useId();
    const errorId = useId();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const updateField = <K extends keyof InviteAccountRequest>(
        field: K,
        value: InviteAccountRequest[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ✅ Si aucun rôle invitable, afficher message d'erreur
    if (invitableRoles.length === 0) {
        return (
            <div
                role="alert"
                className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg"
            >
                <AlertCircle size={20} aria-hidden="true" />
                <p>Vous n'avez pas les permissions pour inviter des comptes.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby={`${formId}-title`}>
            {/* Error global */}
            {error && (
                <div
                    id={errorId}
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg"
                >
                    <AlertCircle size={20} aria-hidden="true" />
                    <p>{error}</p>
                </div>
            )}

            {/* Email */}
            <div>
                <label
                    htmlFor={`${formId}-email`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Email <span aria-label="obligatoire">*</span>
                </label>
                <input
                    id={`${formId}-email`}
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        validationErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="exemple@email.com"
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? `${formId}-email-error` : undefined}
                    required
                    autoFocus
                    disabled={loading}
                />
                {validationErrors.email && (
                    <p id={`${formId}-email-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {validationErrors.email}
                    </p>
                )}
            </div>

            {/* Prénom */}
            <div>
                <label
                    htmlFor={`${formId}-firstName`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Prénom <span aria-label="obligatoire">*</span>
                </label>
                <input
                    id={`${formId}-firstName`}
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        validationErrors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Jean"
                    aria-invalid={!!validationErrors.firstName}
                    aria-describedby={validationErrors.firstName ? `${formId}-firstName-error` : undefined}
                    required
                    disabled={loading}
                />
                {validationErrors.firstName && (
                    <p id={`${formId}-firstName-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {validationErrors.firstName}
                    </p>
                )}
            </div>

            {/* Nom */}
            <div>
                <label
                    htmlFor={`${formId}-lastName`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Nom <span aria-label="obligatoire">*</span>
                </label>
                <input
                    id={`${formId}-lastName`}
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        validationErrors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Dupont"
                    aria-invalid={!!validationErrors.lastName}
                    aria-describedby={validationErrors.lastName ? `${formId}-lastName-error` : undefined}
                    required
                    disabled={loading}
                />
                {validationErrors.lastName && (
                    <p id={`${formId}-lastName-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {validationErrors.lastName}
                    </p>
                )}
            </div>

            {/* Rôle - ✅ Filtré dynamiquement */}
            <div>
                <label
                    htmlFor={`${formId}-role`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Rôle <span aria-label="obligatoire">*</span>
                </label>
                <select
                    id={`${formId}-role`}
                    value={formData.targetRole}
                    onChange={(e) => updateField("targetRole", e.target.value as InvitableRole)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    required
                    disabled={loading || invitableRoles.length === 0}
                >
                    {invitableRoles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    aria-busy={loading}
                >
                    {loading ? "Envoi en cours..." : "Inviter"}
                </button>
            </div>
        </form>
    );
}