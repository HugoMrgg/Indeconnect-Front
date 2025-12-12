import { BannerBrand } from "@/features/banners/BannerBrand";
import { NavBar } from "@/features/navbar/NavBar";

export const ProductLoading = ({
                                   name,
                                   productName,
                                   bannerUrl
                               }: {
    name: string;
    productName?: string;
    bannerUrl?: string | null;
}) => (
    <div className="min-h-full bg-white">
        <BannerBrand name={name} bannerUrl={bannerUrl} />
        <main className="mx-auto max-w-6xl px-4 pb-16">
            <p className="text-gray-500 animate-pulse">
                Chargement de la page du produit {productName}...
            </p>
        </main>
        <NavBar />
    </div>
);
