import { useParams, useNavigate } from "react-router-dom";
import { Product } from "@/types/Product";

export const ProductList = ({ items }: { items: Product[] }) => {
    const navigate = useNavigate();
    const { brandName } = useParams();
    const encodedBrand = encodeURIComponent(brandName ?? "");

    return (
        <div className="space-y-3">
            {items.map((p) => (
                <div
                    onClick={() => navigate(`/brand/${encodeURIComponent(encodedBrand)}/${p.id}`)}
                    key={p.id}
                    className="flex items-center gap-4 rounded-xl border p-3 cursor-pointer hover:bg-gray-50 transition"
                >
                    <img
                        src={p.primaryImageUrl || p.image || "/placeholder.png"}
                        alt={p.name}
                        className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>€ {p.price.toFixed(2)}</span>
                            {p.primaryColor && (
                                <span className="flex items-center gap-1">
                                    <div
                                        className="w-3 h-3 rounded-full border"
                                        style={{ backgroundColor: p.primaryColor.hexa }}
                                    />
                                    <span className="text-xs">{p.primaryColor.name}</span>
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100">
                        Voir
                    </button>
                </div>
            ))}
        </div>
    );
};
