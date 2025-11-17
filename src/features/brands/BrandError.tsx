import { BannerBrand } from "@/features/banners/BannerBrand";
import { NavBar } from "@/features/navbar/NavBar";

export const BrandError = ({ name, message }: { name: string; message: string }) => (
    <div className="min-h-full bg-white">
        <BannerBrand name={name} />
        <main className="mx-auto max-w-6xl px-4 pb-16">
            <p className="text-red-600">{message}</p>
        </main>
        <NavBar scope="products" />
    </div>
);
