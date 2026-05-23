import React, { useState } from "react";

export function UserPreferencesModal({ isOpen, onClose, onSave }) {
  const [allergies, setAllergies] = useState("");
  const [avoid, setAvoid] = useState("");

  if (!isOpen) return null;

  function save() {
    onSave({
      allergies: allergies.split(",").map((x) => x.trim()).filter(Boolean),
      avoidIngredients: avoid.split(",").map((x) => x.trim()).filter(Boolean),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>

        <input
          className="w-full bg-gray-100 p-3 rounded-xl mb-3"
          placeholder="Allergies, ex: peanuts, milk"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />

        <input
          className="w-full bg-gray-100 p-3 rounded-xl mb-4"
          placeholder="Avoid ingredients, ex: sugar, soy"
          value={avoid}
          onChange={(e) => setAvoid(e.target.value)}
        />

        <button onClick={save} className="w-full bg-green-700 text-white p-3 rounded-xl">
          Save Preferences
        </button>
      </div>
    </div>
  );
}