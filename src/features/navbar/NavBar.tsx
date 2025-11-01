import { NavMenu } from "./NavMenu";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

export function NavBar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-gray-200 px-4 py-2 shadow-lg">
            <NavMenu />
            <SearchBar />
            <UserMenu />
        </nav>
    );
}