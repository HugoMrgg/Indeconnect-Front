import { MenuContainer } from "./menu/MenuContainer";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./menu/UserMenu";

type Props = {
    /**
     * Props pour la recherche (viennent de Home.tsx)
     */
    searchValue?: string;
    onSearchChange?: (value: string) => void;
};

export function NavBar({ searchValue, onSearchChange }: Props) {
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full z-50 p-2 sm:p-3">
            <div className="flex items-center w-full max-w-screen-md mx-auto space-x-3">
                <MenuContainer />
                <SearchBar
                    value={searchValue}
                    onChange={onSearchChange}
                />
                <UserMenu />
            </div>
        </div>
    );
}
