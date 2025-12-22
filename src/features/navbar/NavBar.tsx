import { MenuContainer } from "./menu/MenuContainer";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./menu/UserMenu";

type Props = {
    /**
     * Props pour la recherche (viennent de Home.tsx)
     */
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    scope?: string;
};

export function NavBar({ searchValue, onSearchChange, scope }: Props) {
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full z-50 p-2 sm:p-3">
            <div className="flex items-center w-full max-w-screen-md mx-auto space-x-3">
                <MenuContainer />
                <SearchBar
                    scope={scope}
                    value={searchValue}
                    onChange={onSearchChange}
                />
                <UserMenu />
            </div>
        </div>
    );
}
