import { useState, type FormEvent, type CSSProperties } from "react";

type AuthPageProps = {
  onLogin: (email: string, name: string) => void;
};

type PasswordChecks = {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

function checkPassword(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
}

function allPassing(checks: PasswordChecks): boolean {
  return Object.values(checks).every(Boolean);
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checks = checkPassword(password);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "login") {
      if (!email || !password) { setError("Please fill in all fields."); return; }
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("ingredia_session", data.email);
      localStorage.setItem("ingredia_name", data.name || "");
      localStorage.setItem("ingredia_role", data.role || "user");
      onLogin(data.email, data.name || "");
      return;
    }

    if (mode === "reset") {
      if (!email || !oldPassword || !password) { setError("Please fill in all fields."); return; }
      if (!allPassing(checks)) { setError("New password does not meet requirements."); return; }
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("Password reset successfully! You can now sign in.");
      setMode("login");
      return;
    }

    if (!name || !username || !email || !phone || !password) { setError("All fields are required."); return; }
    if (!allPassing(checks)) { setError("Password does not meet all requirements."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, username, phone }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    localStorage.setItem("ingredia_session", data.email);
    localStorage.setItem("ingredia_name", data.name || "");
    localStorage.setItem("ingredia_role", data.role || "user");
    onLogin(data.email, data.name || "");
  }

  function switchMode(newMode: "login" | "signup" | "reset") {
    setMode(newMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
    setOldPassword("");
    setName("");
    setUsername("");
    setPhone("");
  }

  const Req = ({ passing, label }: { passing: boolean; label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: passing ? "#27ae60" : "#aaa" }}>
      <span>{passing ? "✓" : "○"}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ margin: "0 0 12px", fontSize: 48 }}>Ingredia</h1>
        <p style={{ color: "#555", fontSize: 18, marginTop: 0, marginBottom: 24 }}>
          {mode === "login" ? "Read beyond ingredient labels." : mode === "signup" ? "Create your Ingredia account." : "Reset your password."}
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          {mode === "signup" && (
            <>
              <div>
                <label style={labelStyle}>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" style={inputStyle} />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555" style={inputStyle} />
              </div>
            </>
          )}

          {mode === "reset" && (
            <div>
              <label style={labelStyle}>Current Password</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password" style={inputStyle} />
            </div>
          )}

          <div>
            <label style={labelStyle}>{mode === "reset" ? "New Password" : "Password"}</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === "reset" ? "Enter new password" : "Enter password"} style={{ ...inputStyle, paddingRight: 60 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={showButtonStyle}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {(mode === "signup" || mode === "reset") && password.length > 0 && (
            <div style={requirementsBoxStyle}>
              <Req passing={checks.minLength} label="At least 8 characters" />
              <Req passing={checks.hasUpper} label="One uppercase letter" />
              <Req passing={checks.hasLower} label="One lowercase letter" />
              <Req passing={checks.hasNumber} label="One number" />
              <Req passing={checks.hasSpecial} label="One special character (!@#$...)" />
            </div>
          )}

          {(mode === "signup" || mode === "reset") && (
            <div>
              <label style={labelStyle}>Confirm {mode === "reset" ? "New " : ""}Password</label>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password" style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== password ? "#e74c3c" : "#ddd" }} />
              {confirmPassword && confirmPassword !== password && <p style={passwordMismatchStyle}>Passwords do not match</p>}
            </div>
          )}

          {error && <p style={errorStyle}>{error}</p>}
          {success && <p style={{ ...errorStyle, color: "#27ae60", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>{success}</p>}

          <button type="submit" style={buttonStyle}>
            {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {mode === "login" && (
            <>
              <p style={switchTextStyle}>
                Don't have an account?{" "}
                <button onClick={() => switchMode("signup")} style={switchButtonStyle}>Sign up</button>
              </p>
              <p style={{ ...switchTextStyle, marginTop: 8 }}>
                Forgot your password?{" "}
                <button onClick={() => switchMode("reset")} style={switchButtonStyle}>Reset it</button>
              </p>
            </>
          )}
          {(mode === "signup" || mode === "reset") && (
            <p style={switchTextStyle}>
              Already have an account?{" "}
              <button onClick={() => switchMode("login")} style={switchButtonStyle}>Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", fontFamily: "sans-serif", padding: 24 };
const cardStyle: CSSProperties = { background: "#fff", borderRadius: 24, border: "1px solid #e5e5e5", padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" };
const formStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };
const labelStyle: CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 5 };
const inputStyle: CSSProperties = { width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: 12, fontSize: 15, boxSizing: "border-box", outline: "none" };
const showButtonStyle: CSSProperties = { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 12 };
const requirementsBoxStyle: CSSProperties = { background: "#fafafa", border: "1px solid #eee", borderRadius: 8, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 };
const passwordMismatchStyle: CSSProperties = { color: "#e74c3c", fontSize: 12, margin: "4px 0 0" };
const errorStyle: CSSProperties = { color: "#e74c3c", fontSize: 13, margin: 0, padding: "8px 12px", background: "#fff5f5", border: "1px solid #fcd", borderRadius: 6 };
const buttonStyle: CSSProperties = { padding: "12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 };
const switchTextStyle: CSSProperties = { fontSize: 13, color: "#888", margin: 0 };
const switchButtonStyle: CSSProperties = { background: "none", border: "none", color: "#15803d", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 13 };