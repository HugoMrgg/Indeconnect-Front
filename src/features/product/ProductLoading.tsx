import { BannerBrand } from "@/features/banners/BannerBrand";
import { NavBar } from "@/features/navbar/NavBar";
import { ProductDetailSkeleton } from "@/components/skeletons";

export const ProductLoading = ({
                                   name,
                                   bannerUrl
                               }: {
    name: string;
    productName?: string;
    bannerUrl?: string | null;
}) => (
    <div className="min-h-full bg-white">
        <BannerBrand name={name} bannerUrl={bannerUrl} />
        <ProductDetailSkeleton />
        <NavBar scope={"products"} />
    </div>
);
