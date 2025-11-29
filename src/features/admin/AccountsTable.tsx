// @/features/admin/AccountsTable.tsx
import { CheckCircle, XCircle, Mail } from "lucide-react";
import type { Account } from "@/api/services/account/types"; // ✅ Import depuis le service

interface AccountsTableProps {
    accounts: Account[];
    onToggleStatus: (accountId: number, currentStatus: boolean) => Promise<void>;
}

export function AccountsTable({ accounts, onToggleStatus }: AccountsTableProps) {
    if (accounts.length === 0) {
        return (
            <div className="text-center py-16">
                <Mail size={56} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
                <p className="text-gray-500 text-lg">Aucun compte à afficher</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Nom
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Rôle
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Statut
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date création
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{account.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                            {account.firstName} {account.lastName}
                        </td>
                        <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {account.role}
                                </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                {account.isEnabled ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-600" aria-hidden="true" />
                                        <span className="text-sm text-green-600 font-medium">Actif</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} className="text-red-600" aria-hidden="true" />
                                        <span className="text-sm text-red-600 font-medium">Inactif</span>
                                    </>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(account.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => onToggleStatus(account.id, account.isEnabled)}
                                className="text-xs px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-medium"
                                aria-label={`${account.isEnabled ? 'Désactiver' : 'Réactiver'} le compte de ${account.firstName} ${account.lastName}`}
                            >
                                {account.isEnabled ? "Désactiver" : "Réactiver"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
