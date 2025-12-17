import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Brand } from "@/types/brand";
import { MapPin, Star } from "lucide-react";

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

/**
 * Stars with partial fill (0..100%) per star.
 * Works with lucide Star by overlaying a clipped filled star on top of the outline.
 */
const StarRating: React.FC<{ value?: number; size?: number }> = ({ value, size = 16 }) => {
    const rating = value === undefined || value === null ? null : clamp(value, 0, 5);

    const percents = useMemo(() => {
        if (rating === null) return Array(5).fill(0);
        return Array.from({ length: 5 }, (_, i) => {
            const raw = rating - i;            // ex: 4.6 - 4 = 0.6 for 5th star
            const pct = clamp(raw, 0, 1) * 100;
            return pct;
        });
    }, [rating]);

    return (
        <div className="flex items-center gap-1 text-yellow-500">
            {percents.map((pct, i) => (
                <div key={i} className="relative" style={{ width: size, height: size }}>
                    {/* outline star */}
                    <Star
                        size={size}
                        className="absolute inset-0"
                        fill="none"
                    />
                    {/* clipped fill */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${pct}%` }}
                    >
                        <Star
                            size={size}
                            className="absolute inset-0"
                            fill="currentColor"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const BrandCard: React.FC<Brand> = ({
                                               name,
                                               logoUrl,
                                               description,
                                               ethicsScoreProduction,
                                               ethicsScoreTransport,
                                               address,
                                               distanceKm,
                                               userRating,
                                           }) => {
    const navigate = useNavigate();

    const prod = useMemo(() => clamp((ethicsScoreProduction ?? 0) / 20, 0, 5), [ethicsScoreProduction]);
    const transp = useMemo(() => clamp((ethicsScoreTransport ?? 0) / 20, 0, 5), [ethicsScoreTransport]);

    const initials = useMemo(() => {
        const parts = (name ?? "").trim().split(/\s+/);
        const a = parts[0]?.[0] ?? "";
        const b = parts[1]?.[0] ?? "";
        return (a + b).toUpperCase() || "B";
    }, [name]);

    const onOpen = () => navigate(`/brand/${encodeURIComponent(name)}`);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen() : null)}
            className="group cursor-pointer min-w-96 max-w-96 min-h-56 p-4 rounded-3xl border border-gray-100 bg-white shadow-sm
                 transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/10"
        >
            {/* TOP: logo + name + rating + distance */}
            <div className="flex items-start gap-3">
                {/* Logo always readable */}
                <div className="h-14 w-14 shrink-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden grid place-items-center">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={`${name} logo`}
                            className="h-full w-full object-contain p-2"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-gray-700">{initials}</span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold tracking-tight truncate">{name}</h3>

                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-700 border border-gray-100">
              <MapPin size={14} />
                            {distanceKm !== undefined ? `${Math.round(distanceKm as number)} km` : "?"}
            </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                        <StarRating value={userRating} size={16} />
                        <span className="text-sm text-gray-600">
              {userRating !== undefined && userRating !== null ? userRating.toFixed(1) : "N/A"}
            </span>
                    </div>
                </div>
            </div>

            {/* ETHICS blocks (cleaner) */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">Éthique (production)</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-white border border-gray-100 overflow-hidden">
                        <div className="h-full bg-gray-900/70 rounded-full" style={{ width: `${(prod / 5) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{prod.toFixed(1)} / 5</p>
                </div>

                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">Éthique (transport)</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-white border border-gray-100 overflow-hidden">
                        <div className="h-full bg-gray-900/70 rounded-full" style={{ width: `${(transp / 5) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{transp.toFixed(1)} / 5</p>
                </div>
            </div>

            {/* Description */}
            {description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Footer chips */}
            <div className="mt-4 flex flex-wrap gap-2">
                {address && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            {address}
          </span>
                )}
            </div>
        </div>
    );
};