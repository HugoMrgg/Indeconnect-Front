import { Link } from "react-router-dom";
import { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import i18n from '@/i18n';

export const breadcrumbRoutes: BreadcrumbsRoute[] = [
    {
        path: "/",
        breadcrumb: () => {
            return <Link to="/">{i18n.t('routes.breadcrumbs.home')}</Link>;
        },
    },
    {
        path: "/brands",
        breadcrumb: () => {
            return <Link to="/brands">{i18n.t('routes.breadcrumbs.brands')}</Link>;
        },
    },
    {
        path: "/brands/:brandName",
        breadcrumb: ({ match }) => (
            <span className="text-gray-900 font-medium truncate max-w-[160px] sm:max-w-xs">
        {decodeURIComponent(match.params.brandName ?? "")}
      </span>
        ),
    },
];
