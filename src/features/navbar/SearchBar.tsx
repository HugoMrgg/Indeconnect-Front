import { Search } from "lucide-react";

export function SearchBar() {
    return (
        <div className="flex-1 mx-4">
            <Search size={24} />
            <input
                type="text"
                placeholder="Search what you want"
                className="w-full rounded-full bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-black"
            />
        </div>
    );
}
