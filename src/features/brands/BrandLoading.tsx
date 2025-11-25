import { BannerBrand } from "@/features/banners/BannerBrand";
import { NavBar } from "@/features/navbar/NavBar";

export const BrandLoading = ({ name }: { name: string }) => (
    <div className="min-h-full bg-white">
        <BannerBrand name={name} />
        <main className="mx-auto max-w-6xl px-4 pb-16">
            <p className="text-gray-500 animate-pulse">
                Chargement de la page des produits de {name}...
            </p>
        </main>
        <NavBar/>
    </div>
);
