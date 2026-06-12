import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterPanelProps {
  onCategoryChange: (categories: string[]) => void;
  onDietaryChange: (restrictions: string[]) => void;
}

export function FilterPanel({
  onCategoryChange,
  onDietaryChange,
}: FilterPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dietaryOpen, setDietaryOpen] = useState(false);

  const categories = ["Food", "Drinks", "Skin Care", "Cosmetics", "Supplements"];

  const dietaryOptions = [
    "Vegan",
    "Vegetarian",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Pescatarian",
  ];

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    onCategoryChange(updated);
  };

  const toggleDietary = (restriction: string) => {
    const updated = selectedDietary.includes(restriction)
      ? selectedDietary.filter((d) => d !== restriction)
      : [...selectedDietary, restriction];

    setSelectedDietary(updated);
    onDietaryChange(updated);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDietary([]);
    onCategoryChange([]);
    onDietaryChange([]);
  };

  return (
    <div className="bg-gray-50 px-4 py-4">
      <div className="mx-auto max-w-md">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Filters</h2>

          {(selectedCategories.length > 0 || selectedDietary.length > 0) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Category Filter */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setCategoryOpen(!categoryOpen);
                setDietaryOpen(false);
              }}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                selectedCategories.length > 0
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Category

              {selectedCategories.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                  {selectedCategories.length}
                </span>
              )}

              <ChevronDown className="h-4 w-4" />
            </button>

            {categoryOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 accent-green-600"
                    />

                    <span className="font-medium text-gray-700">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Restrictions Filter */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setDietaryOpen(!dietaryOpen);
                setCategoryOpen(false);
              }}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                selectedDietary.length > 0
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Dietary

              {selectedDietary.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                  {selectedDietary.length}
                </span>
              )}

              <ChevronDown className="h-4 w-4" />
            </button>

            {dietaryOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-60 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                {dietaryOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDietary.includes(option)}
                      onChange={() => toggleDietary(option)}
                      className="h-4 w-4 accent-green-600"
                    />

                    <span className="font-medium text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Filter Chips */}
        {(selectedCategories.length > 0 || selectedDietary.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
              >
                {category}
              </span>
            ))}

            {selectedDietary.map((diet) => (
              <span
                key={diet}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {diet}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}