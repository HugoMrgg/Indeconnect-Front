import { useState } from "react";
import { SlidersHorizontal , Search} from "lucide-react";

export function SearchBar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-grow items-center bg-black rounded-2xl h-12 shadow-inner pr-1">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-2xl bg-black text-white"
            >
                <SlidersHorizontal size={24} />
            </button>

            <input
                type="text"
                placeholder="Search what you want"
                className="w-full focus:ring-2 bg-black text-white"
            />
            <Search size={20} className="text-white mr-1"/>
        </div>
    );
}
