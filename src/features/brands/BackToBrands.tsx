import { Link } from "react-router-dom";

export const BackToBrands = () => (
    <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Retour aux marques
        </Link>
    </div>
);
