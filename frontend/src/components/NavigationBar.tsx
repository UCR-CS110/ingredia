import { Search, ScanBarcode, LogOut } from "lucide-react";
import { useState } from "react";

interface NavigationBarProps {
  onSearchChange: (query: string) => void;
  onScanClick: () => void;
  currentUser?: string | null;
  currentUserName?: string;
  onLogout: () => void;
}

export function NavigationBar({
  onSearchChange,
  onScanClick,
  currentUser,
  currentUserName,
  onLogout,
}: NavigationBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-md px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-green-700">Ingredia</h1>
            {currentUser && (
              <p className="max-w-[220px] truncate text-xs text-gray-400">
                {currentUserName ? currentUserName : currentUser}
              </p>
            )}
          </div>
          {currentUser && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a product"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={onScanClick}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md transition hover:bg-green-700 active:scale-95"
            aria-label="Scan product"
          >
            <ScanBarcode className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}