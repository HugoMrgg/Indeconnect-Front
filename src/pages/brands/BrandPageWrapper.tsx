import { useParams } from "react-router-dom";
import { BrandPage } from "./Brand";

export function BrandPageWrapper() {
    const { brandName } = useParams();
    return <BrandPage key={brandName} />;
}
