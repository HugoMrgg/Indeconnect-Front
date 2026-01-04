import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const BackToBrands = () => {
    const { t } = useTranslation();

    return (
        <div className="mb-6">
            <Link to="/" className="text-blue-600 hover:underline text-sm">
                ← {t('brands.back_to_brands')}
            </Link>
        </div>
    );
};
