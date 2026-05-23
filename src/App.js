import React, { useState } from "react";
import LoginPage from "./LoginPage";
import { ProductCard } from "./ProductCard";
import { ScanModal } from "./ScanModal";
import { UserPreferencesModal } from "./UserPreferencesModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [showScan, setShowScan] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({ allergies: [], avoidIngredients: [] });
  const [search, setSearch] = useState("");

  const products = [
    {
      id: "1",
      name: "Organic Almond Milk",
      brand: "Nature's Best",
      category: "Drinks",
      score: 85,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600",
      ingredients: ["Water", "Almonds", "Sea Salt", "Gellan Gum"],
    },
    {
      id: "2",
      name: "Protein Energy Bar",
      brand: "FitLife",
      category: "Food",
      score: 42,
      image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600",
      ingredients: ["Peanuts", "Sugar", "Whey Protein", "Soy Lecithin"],
    },
  ];

  if (!user) return <LoginPage onLogin={setUser} />;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
  <div style={{ minHeight: "100vh", background: "#f0fdf4", padding: "24px" }}>
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <nav
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "42px", margin: "0 0 16px" }}>Ingredia</h1>

        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowScan(true)}>Scan</button>
          <button onClick={() => setShowPreferences(true)}>Preferences</button>
        </div>
      </nav>

      <main>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
          Welcome, {user.name}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              preferences={preferences}
            />
          ))}
        </div>
      </main>
    </div>

    <ScanModal isOpen={showScan} onClose={() => setShowScan(false)} />

    <UserPreferencesModal
      isOpen={showPreferences}
      onClose={() => setShowPreferences(false)}
      onSave={setPreferences}
    />
  </div>
);
}