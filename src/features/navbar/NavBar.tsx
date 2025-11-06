import { NavMenu } from "./NavMenu";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

type NavBarProps = {
    scope: string;
    searchBarEnabled?: boolean; // default: true
    onToggleFilters?: () => void;
};

export function NavBar({ scope, searchBarEnabled = true, onToggleFilters }: NavBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full shadow-2xl z-50 p-2 sm:p-3">
            <div className="flex items-center w-full max-w-screen-md mx-auto space-x-3">
                <NavMenu/>
                <SearchBar scope={scope} enabled={searchBarEnabled} onToggleFilters={onToggleFilters}/>
                <UserMenu/>
            </div>
        </div>
    );
}