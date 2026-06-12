import {
  Home,
  TrendingUp,
  Settings,
  Heart,
  History,
  Sparkles,
  ScanBarcode,
} from "lucide-react";

interface SidebarProps {
  onShowPreferences: () => void;
}

export function Sidebar({ onShowPreferences }: SidebarProps) {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-gray-100 bg-gray-50/70 lg:block">
      <div className="sticky top-20 p-5">
        {/* Main card */}
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wide text-gray-400">
            Explore
          </h3>

          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 text-left text-green-700 transition hover:bg-green-100">
              <Home className="h-5 w-5" />
              <span className="text-sm font-semibold">For You</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              <History className="h-5 w-5" />
              <span className="text-sm font-medium">Scan History</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Saved Products</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Popular Products</span>
            </button>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <button
              onClick={onShowPreferences}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Preferences</span>
            </button>
          </div>
        </div>

        {/* Tip card */}
        <div className="mt-4 rounded-3xl bg-green-600 p-5 text-white shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
            <ScanBarcode className="h-5 w-5" />
          </div>

          <h4 className="text-sm font-bold">Scan smarter</h4>

          <p className="mt-1 text-xs leading-relaxed text-green-50">
            Scan a barcode or ingredient label to get a quick product score.
          </p>

          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50">
            <Sparkles className="h-4 w-4" />
            Try Scan
          </button>
        </div>
      </div>
    </aside>
  );
}