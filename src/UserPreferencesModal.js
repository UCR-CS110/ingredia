import React, { useState } from "react";

export function UserPreferencesModal({ isOpen, onClose, onSave }) {
  const [allergies, setAllergies] = useState("");
  const [avoid, setAvoid] = useState("");

  if (!isOpen) return null;

  function save() {
    onSave({
      allergies: allergies
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      avoidIngredients: avoid
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    onClose();
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "300px",
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        padding: "20px",
        zIndex: 999,
        marginTop: "8px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
        Your Preferences
      </h2>

      <input
        placeholder="Allergies, ex: peanuts, milk"
        value={allergies}
        onChange={(e) => setAllergies(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "1.5px solid #e2e8f0",
          fontSize: "14px",
          outline: "none",
        }}
      />

      <input
        placeholder="Avoid ingredients, ex: sugar, soy"
        value={avoid}
        onChange={(e) => setAvoid(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "16px",
          borderRadius: "10px",
          border: "1.5px solid #e2e8f0",
          fontSize: "14px",
          outline: "none",
        }}
      />

      <button
        onClick={save}
        style={{
          width: "100%",
          padding: "10px",
          background: "#15803d",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "bold",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Save Preferences
      </button>
    </div>
  );
}
