import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {BadgeCheck, Dices} from "lucide-react";

export function BrandMenu() {
    const [ ,setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/*<div className="flex items-center gap-6">*/}
                <button
                    onClick={() => {
                        setOpen(false);
                        navigate("/");
                    }}
                    className="flex items-center gap-2 hover:text-gray-300 transition"
                >
                    <Dices size={18} />
                    IndeConnect
                </button>

                <button
                    onClick={() => {
                        setOpen(false);
                        navigate("/devenir-marque");
                    }}
                    className="flex items-center gap-2 hover:text-gray-300 transition"
                >
                    <BadgeCheck size={16} />
                    Devenir une marque
                </button>
            {/*</div>*/}
        </>
    );
}