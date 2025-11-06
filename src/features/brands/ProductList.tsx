import { Product } from "@/types/Product";

export const ProductList = ({ items }: { items: Product[] }) => (
    <div className="space-y-3">
        {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border p-3">
                <img
                    src={p.image}
                    alt={p.name}
                    className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">
                        € {p.price.toFixed(2)}
                    </div>
                </div>
                <button className="rounded-lg border px-3 py-2 text-sm">
                    Voir
                </button>
            </div>
        ))}
    </div>
);
