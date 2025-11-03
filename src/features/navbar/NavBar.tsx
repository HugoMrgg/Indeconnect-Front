import { NavMenu } from "./NavMenu";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

export function NavBar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full shadow-2xl z-50 p-2 sm:p-3">
            <div className="flex items-center w-full max-w-screen-md mx-auto space-x-2">
                <NavMenu/>
                <SearchBar/>
                <UserMenu/>
            </div>
        </div>
    );
}