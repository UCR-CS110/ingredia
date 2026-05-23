import React, { useState } from "react";
import { ReviewSection } from "./ReviewSection";

export function ProductCard({ product, preferences }) {
  const [showIngredients, setShowIngredients] = useState(false);

  const unsafe = product.ingredients.some((ingredient) =>
    preferences.allergies.some((a) =>
      ingredient.toLowerCase().includes(a.toLowerCase())
    ) ||
    preferences.avoidIngredients.some((a) =>
      ingredient.toLowerCase().includes(a.toLowerCase())
    )
  );

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "260px",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div style={{ padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "24px", margin: "0 0 6px" }}>
              {product.name}
            </h3>
            <p style={{ color: "#555", margin: 0 }}>{product.brand}</p>
          </div>

          <span
            style={{
              background: "#f3f4f6",
              padding: "8px 12px",
              borderRadius: "10px",
              height: "fit-content",
            }}
          >
            {product.category}
          </span>
        </div>

        <p style={{ fontWeight: "bold", marginTop: "16px" }}>
          Score: {product.score}/100
        </p>

        <div
          style={{
            marginTop: "12px",
            padding: "14px",
            borderRadius: "14px",
            background: unsafe ? "#fee2e2" : "#dcfce7",
            color: unsafe ? "#b91c1c" : "#166534",
          }}
        >
          {unsafe
            ? "Warning: This may conflict with your preferences."
            : "Looks safe based on your preferences."}
        </div>

        <button
          onClick={() => setShowIngredients(!showIngredients)}
          style={{ marginTop: "16px" }}
        >
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>

        {showIngredients && (
          <ul style={{ color: "#555" }}>
            {product.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        )}

        <ReviewSection />
      </div>
    </div>
  );
}