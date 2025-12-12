import { Link } from "react-router-dom";
import { BreadcrumbsRoute } from "use-react-router-breadcrumbs";

export const breadcrumbRoutes: BreadcrumbsRoute[] = [
    {
        path: "/",
        breadcrumb: () => <Link to="/">Accueil</Link>,
    },
    {
        path: "/brands",
        breadcrumb: () => <Link to="/brands">Marques</Link>,
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
