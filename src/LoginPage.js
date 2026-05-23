import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#f0fdf4",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "32px",
          borderRadius: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "48px", margin: "0 0 12px" }}>
          Ingredia
        </h1>

        <p style={{ fontSize: "18px", color: "#555", marginBottom: "24px" }}>
          Read beyond ingredient labels.
        </p>

        <input
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input placeholder="Password" type="password" />

        <button onClick={() => onLogin({ name: name || "Demo User" })}>
          Login
        </button>
      </div>
    </div>
  );
}