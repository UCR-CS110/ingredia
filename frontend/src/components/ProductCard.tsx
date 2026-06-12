import {
  Plus,
  Droplets,
  Flame,
  Wheat,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type ProductIssue = {
  icon: "plus" | "droplets" | "flame" | "wheat";
  label: string;
  value: string;
  severity?: "low" | "medium" | "high";
};

type Product = {
  id: string | number;
  name: string;
  brand: string;
  image: string;
  score: number;
  negatives?: ProductIssue[];
  positives?: ProductIssue[];
};

interface ProductCardProps {
  product: Product;
  onClick: (id: string | number) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const negatives = product.negatives ?? [];
  const positives = product.positives ?? [];

  const getScoreStyles = (score: number) => {
    if (score >= 75) {
      return {
        circle: "bg-green-500",
        text: "text-green-700",
        soft: "bg-green-50 border-green-100",
        label: "Excellent",
      };
    }

    if (score >= 50) {
      return {
        circle: "bg-yellow-500",
        text: "text-yellow-700",
        soft: "bg-yellow-50 border-yellow-100",
        label: "Good",
      };
    }

    if (score >= 25) {
      return {
        circle: "bg-orange-500",
        text: "text-orange-700",
        soft: "bg-orange-50 border-orange-100",
        label: "Mediocre",
      };
    }

    return {
      circle: "bg-red-500",
      text: "text-red-700",
      soft: "bg-red-50 border-red-100",
      label: "Poor",
    };
  };

  const getSeverityColor = (severity?: string) => {
    if (severity === "high") return "bg-red-500";
    if (severity === "medium") return "bg-yellow-500";
    return "bg-gray-300";
  };

  const renderIcon = (icon: ProductIssue["icon"]) => {
    const className = "h-4 w-4";

    if (icon === "plus") return <Plus className={className} />;
    if (icon === "droplets") return <Droplets className={className} />;
    if (icon === "flame") return <Flame className={className} />;
    if (icon === "wheat") return <Wheat className={className} />;

    return null;
  };

  const scoreStyles = getScoreStyles(product.score);

  return (
    <button
      type="button"
      onClick={() => onClick(product.id)}
      className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
    >
      {/* Top Section */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900">
              {product.name}
            </h3>

            <p className="mt-1 truncate text-sm text-gray-500">
              {product.brand}
            </p>

            <div
              className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${scoreStyles.soft} ${scoreStyles.text}`}
            >
              {scoreStyles.label}
            </div>
          </div>

          {/* Score */}
          <div className="flex shrink-0 flex-col items-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${scoreStyles.circle} shadow-sm`}
            >
              <span className="text-xl font-bold text-white">
                {product.score}
              </span>
            </div>

            <span className="mt-1 text-[11px] font-medium text-gray-400">
              /100
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-red-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Negatives</span>
            </div>

            <p className="text-sm font-semibold text-gray-900">
              {negatives.length}
            </p>

            <p className="text-xs text-gray-500">
              {negatives.length === 1 ? "issue found" : "issues found"}
            </p>
          </div>

          <div className="rounded-2xl bg-green-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Positives</span>
            </div>

            <p className="text-sm font-semibold text-gray-900">
              {positives.length}
            </p>

            <p className="text-xs text-gray-500">
              {positives.length === 1 ? "benefit found" : "benefits found"}
            </p>
          </div>
        </div>
      </div>

      {/* Negatives Preview */}
      {negatives.length > 0 && (
        <div className="px-4 pb-3">
          <div className="space-y-2">
            {negatives.slice(0, 2).map((negative, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500">
                  {renderIcon(negative.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {negative.label}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {negative.value}
                  </p>
                </div>

                <div
                  className={`h-2.5 w-2.5 rounded-full ${getSeverityColor(
                    negative.severity
                  )}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positives Preview */}
      {positives.length > 0 && (
        <div className="px-4 pb-3">
          <div className="space-y-2">
            {positives.slice(0, 2).map((positive, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500">
                  {renderIcon(positive.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {positive.label}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {positive.value}
                  </p>
                </div>

                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between text-sm font-medium text-gray-500">
          <span>View details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}