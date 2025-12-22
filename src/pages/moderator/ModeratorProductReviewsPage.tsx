import React, { useMemo, useState } from "react";
import { Loader2, Check, X, RefreshCcw, Search } from "lucide-react";
import { useModeratorReviews } from "@/hooks/Admin/useAdminProductReviews";
import { ReviewStatus } from "@/api/services/reviews/moderator/type";
import { AuthPanel } from "@/features/user/auth/AuthPanel";
import { NavBar } from "@/features/navbar/NavBar";

const statusOptions: Array<ReviewStatus | "All"> = ["All", "Enabled", "Disabled"];

const statusLabel = (s: string) => {
    if (s === "Enabled") return "Publié";
    if (s === "Disabled") return "Masqué";
    return s;
};

const statusBadgeClass = (s: string) => {
    if (s === "Enabled") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (s === "Disabled") return "border-rose-200 bg-rose-50 text-rose-700";
    return "border-gray-200 bg-white text-gray-700";
};

export const ModeratorProductReviewsPage: React.FC = () => {
    const {
        filters,
        setFilters,
        data,
        loading,
        actingId,
        error,
        totalPages,
        refetch,
        approve, // => met en Enabled
        reject,  // => met en Disabled
    } = useModeratorReviews();

    const [productIdInput, setProductIdInput] = useState(
        filters.productId ? String(filters.productId) : ""
    );

    const [searchQuery, setSearchQuery] = useState("");
    const query = searchQuery.trim().toLowerCase();

    const rows = useMemo(() => data.items ?? [], [data.items]);

    const filteredRows = useMemo(() => {
        if (!query) return rows;

        return rows.filter((r) => {
            const comment = (r.comment ?? "").toLowerCase();
            const user = (r.userName ?? "").toLowerCase();
            const productName = (r.productName ?? "").toLowerCase();
            const productId = typeof r.productId === "number" ? String(r.productId) : "";

            return (
                comment.includes(query) ||
                user.includes(query) ||
                productName.includes(query) ||
                productId.includes(query)
            );
        });
    }, [rows, query]);

    return (
        <>
            <AuthPanel />

            <main className="relative bg-white min-h-screen mx-auto pb-16">
                <section className="bg-[#C9B38C] px-6 py-16 relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-start gap-6">
                            <div>
                                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                                    Modération des Reviews Produits
                                </h1>
                                <div className="w-24 h-1 bg-gray-900 mb-6" aria-hidden="true"></div>
                                <p className="text-gray-700 text-lg">
                                    Les commentaires sont publiés automatiquement. Ici, tu peux les masquer ou les réactiver.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Modération • Reviews produits
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Enabled = visible sur le site • Disabled = masqué (mais conservé)
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={refetch}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                            disabled={loading}
                        >
                            <RefreshCcw size={16} /> Recharger
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-3">
                                <label className="text-xs text-gray-500">Statut</label>
                                <select
                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                    value={(filters.status as any) ?? "All"}
                                    onChange={(e) =>
                                        setFilters((p) => ({
                                            ...p,
                                            // "All" => null côté back (tu dis gérer ça dans le hook)
                                            status: e.target.value as any,
                                            page: 1,
                                        }))
                                    }
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {s === "All" ? "All (tous)" : s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-3">
                                <label className="text-xs text-gray-500">ProductId (optionnel)</label>
                                <input
                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                    value={productIdInput}
                                    onChange={(e) => setProductIdInput(e.target.value)}
                                    placeholder="ex: 123"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                                    onClick={() => {
                                        const v = productIdInput.trim();
                                        setFilters((p) => ({
                                            ...p,
                                            productId: v ? Number(v) : null,
                                            page: 1,
                                        }));
                                    }}
                                >
                                    Appliquer
                                </button>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500">PageSize</label>
                                <select
                                    className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200"
                                    value={filters.pageSize}
                                    onChange={(e) =>
                                        setFilters((p) => ({
                                            ...p,
                                            pageSize: Number(e.target.value),
                                            page: 1,
                                        }))
                                    }
                                >
                                    {[10, 20, 50].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500">Recherche</label>
                                <div className="relative mt-1">
                                    <Search
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Commentaire, user, produit…"
                                    />
                                </div>
                            </div>
                        </div>

                        {error ? (
                            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                                {error}
                            </div>
                        ) : null}
                    </div>

                    {/* Table */}
                    <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {loading
                                    ? "Chargement…"
                                    : query
                                        ? `${filteredRows.length} / ${rows.length} review(s) (filtrées)`
                                        : `${rows.length} review(s)`}
                            </div>

                            <div className="text-sm text-gray-600">
                                Page <span className="font-semibold text-gray-900">{filters.page}</span> /{" "}
                                {totalPages}
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-10 flex items-center justify-center text-gray-600">
                                <Loader2 className="animate-spin" />
                                <span className="ml-2">Chargement…</span>
                            </div>
                        ) : filteredRows.length === 0 ? (
                            <div className="p-10 text-center text-gray-600">Aucun résultat trouvé.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredRows.map((r) => {
                                    const currentStatus = String(r.status); // "Enabled" | "Disabled"
                                    const isEnabled = currentStatus === "Enabled";
                                    const isDisabled = currentStatus === "Disabled";

                                    return (
                                        <div key={r.id} className="p-4">
                                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold text-gray-900">#{r.id}</span>

                                                        <span
                                                            className={[
                                                                "text-xs px-2 py-1 rounded-full border",
                                                                statusBadgeClass(currentStatus),
                                                            ].join(" ")}
                                                            title={currentStatus}
                                                        >
                              {statusLabel(currentStatus)}
                            </span>

                                                        <span className="text-sm text-gray-600">
                              {r.userName} • {r.rating}/5
                            </span>

                                                        {typeof r.productId === "number" ? (
                                                            <span className="text-sm text-gray-500">• Produit {r.productId}</span>
                                                        ) : null}

                                                        {r.productName ? (
                                                            <span className="text-sm text-gray-500">({r.productName})</span>
                                                        ) : null}
                                                    </div>

                                                    <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap break-words">
                                                        {r.comment ?? (
                                                            <span className="text-gray-400 italic">Pas de commentaire</span>
                                                        )}
                                                    </div>

                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Créé: {new Date(r.createdAt).toLocaleString()}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 md:ml-4">
                                                    {isEnabled ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => reject(r.id)} // => passe en Disabled
                                                            disabled={actingId === r.id}
                                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                                                            title="Masquer ce commentaire"
                                                        >
                                                            <X size={16} /> Désactiver
                                                        </button>
                                                    ) : isDisabled ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => approve(r.id)} // => repasse en Enabled
                                                            disabled={actingId === r.id}
                                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                                                            title="Rendre ce commentaire visible"
                                                        >
                                                            <Check size={16} /> Réactiver
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Aucune action</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                                onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                                disabled={filters.page <= 1 || loading}
                            >
                                ← Précédent
                            </button>

                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                                onClick={() =>
                                    setFilters((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))
                                }
                                disabled={filters.page >= totalPages || loading}
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* NavBar globale */}
            <NavBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        </>
    );
};
