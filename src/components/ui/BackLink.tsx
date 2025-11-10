import { useNavigate } from "react-router-dom";
import { CircleChevronLeft } from "lucide-react";

export const BackLink = () => {
    const navigate = useNavigate();

    return (
        <span
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer transition active:scale-[0.97]"
        >
          <CircleChevronLeft size={20} /> Page d'avant
        </span>
    );
}
