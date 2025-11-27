import {ProductDetail} from "@/types/Product";

interface ProductInfoProps {
    product: ProductDetail;
    brandName: string;
}

export function ProductInfo({ product, brandName }: ProductInfoProps) {
    return (
        <div>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="text-2xl mt-2 font-bold">
                {product.salePrice ? (
                    <>
                        <span className="text-red-600">{product.salePrice} €</span>
                        <span className="line-through ml-2 text-gray-500">
                            {product.price} €
                        </span>
                    </>
                ) : (
                    `${product.price} €`
                )}
            </p>
        </div>
    );
}
