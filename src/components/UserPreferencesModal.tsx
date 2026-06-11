import { X, Leaf, AlertTriangle, Ban, Check } from "lucide-react";
import { useState } from "react";

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: {
    dietaryRestrictions: string[];
    allergies: string[];
    avoidIngredients: string[];
  }) => void;
}

export function UserPreferencesModal({
  isOpen,
  onClose,
  onSave,
}: UserPreferencesModalProps) {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState("");

  const dietaryOptions = [
    "Vegan",
    "Vegetarian",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Pescatarian",
    "Kosher",
    "Halal",
  ];

  const allergyOptions = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Eggs",
    "Soy",
    "Wheat",
    "Fish",
    "Shellfish",
  ];

  if (!isOpen) return null;

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const toggleAllergy = (option: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSave = () => {
    const avoidIngredients = customIngredients
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);

    onSave({
      dietaryRestrictions: selectedDietary,
      allergies: selectedAllergies,
      avoidIngredients,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Personalize scores based on your diet, allergies, and
                ingredients you avoid.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
              aria-label="Close preferences modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 px-5 py-5">
          {/* Dietary Restrictions */}
          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <Leaf className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Dietary Restrictions
                </h3>
                <p className="text-xs text-gray-500">
                  Choose any diets you follow.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((option) => {
                const selected = selectedDietary.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDietary(option)}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{option}</span>

                    {selected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Allergies */}
          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">Allergies</h3>
                <p className="text-xs text-gray-500">
                  These should be flagged strongly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((option) => {
                const selected = selectedAllergies.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleAllergy(option)}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{option}</span>

                    {selected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Custom Ingredients */}
          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-700">
                <Ban className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Ingredients to Avoid
                </h3>
                <p className="text-xs text-gray-500">
                  Separate ingredients with commas.
                </p>
              </div>
            </div>

            <textarea
              placeholder="Example: palm oil, artificial sweeteners, red 40"
              className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100"
              rows={4}
              value={customIngredients}
              onChange={(e) => setCustomIngredients(e.target.value)}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white px-5 py-4">
          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-green-600 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-[0.99]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}