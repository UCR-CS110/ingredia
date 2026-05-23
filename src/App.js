import React, { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import { ProductCard } from "./ProductCard";
import { ScanModal } from "./ScanModal";
import { UserPreferencesModal } from "./UserPreferencesModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [showScan, setShowScan] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    allergies: [],
    avoidIngredients: [],
  });
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?q=${search}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.filter((p) => p.name)))
      .catch((err) => console.error(err));
  }, [search]);

  if (!user) return <LoginPage onLogin={setUser} />;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", padding: "24px" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
          overflow: "visible",
          background: "white",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
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
            <button onClick={() => setShowPreferences(true)}>
              Preferences
            </button>
          </div>

          {showPreferences && (
            <UserPreferencesModal
              isOpen={showPreferences}
              onClose={() => setShowPreferences(false)}
              onSave={setPreferences}
            />
          )}
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
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                preferences={preferences}
              />
            ))}
          </div>
        </main>
      </div>

      <ScanModal isOpen={showScan} onClose={() => setShowScan(false)} />
    </div>
  );
}
