import useBreadcrumbs from "use-react-router-breadcrumbs";
import { breadcrumbRoutes } from "@/routes/breadcrumbs";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function BrandBreadcrumbs() {
    const { t } = useTranslation();
    const breadcrumbs = useBreadcrumbs(breadcrumbRoutes);

    return (
        <nav
            className="mb-4"
            aria-label={t('routes.breadcrumbs.aria')}
        >
            <ol className="flex items-center gap-2 text-sm">
                {breadcrumbs.map(({ breadcrumb, match }, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li key={match.pathname} className="flex items-center gap-2">
                            {/* Séparateur (sauf pour le premier) */}
                            {!isFirst && (
                                <ChevronRight
                                    size={14}
                                    className="text-gray-400"
                                    aria-hidden="true"
                                />
                            )}

                            {/* Lien ou texte */}
                            {isLast ? (
                                <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {breadcrumb}
                </span>
                            ) : (
                                <Link
                                    to={match.pathname}
                                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {isFirst && <Home size={14} />}
                                    <span>{breadcrumb}</span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}