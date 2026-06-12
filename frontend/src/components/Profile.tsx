import { useState, useEffect } from "react";
import { X, User, Save, ShieldCheck } from "lucide-react";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  currentUserName: string;
  onProfileUpdate: (name: string) => void;
  currentUserRole?: string;
  onDashboardClick?: () => void;
}

export function Profile({ isOpen, onClose, currentUser, currentUserName, onProfileUpdate }: ProfileProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("explorer");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [tab, setTab] = useState<"profile" | "password" | "account">("profile");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess("");
      fetch(`http://localhost:5000/api/auth/profile?email=${encodeURIComponent(currentUser)}`)
        .then(r => r.json())
        .then(data => {
          setName(data.name || "");
          setUsername(data.username || "");
          setPhone(data.phone || "");
          setRole(data.role || "explorer");
        })
        .catch(() => {
          setName(currentUserName || "");
          setRole(localStorage.getItem("ingredia_role") || "explorer");
        });
    }
  }, [isOpen, currentUser, currentUserName]);

  if (!isOpen) return null;

  async function handleSaveProfile() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser, name, username, phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("ingredia_name", data.name || "");
      onProfileUpdate(data.name || "");
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    if (!oldPassword || !newPassword) { setError("Please fill in all fields."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestExpert() {
    setRequesting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/request-expert", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setRole("expert");
      localStorage.setItem("ingredia_role", "expert");
      setSuccess("You're now an Expert! 🎉");
    } catch {
      setError("Failed to request expert status");
    } finally {
      setRequesting(false);
    }
  }

  const roleBadgeColor = role === "admin"
    ? "bg-purple-100 text-purple-700"
    : role === "expert"
    ? "bg-blue-100 text-blue-700"
    : "bg-green-100 text-green-700";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Profile</h2>
              <p className="text-xs text-gray-500">{currentUser}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["profile", "password", "account"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition capitalize ${tab === t ? "border-b-2 border-green-600 text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
              {t === "account" ? "Account" : t === "password" ? "Password" : "Profile"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 px-5 py-5 space-y-4">
          {tab === "profile" && (
            <>
              <div className="rounded-3xl bg-white p-4 shadow-sm space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input type="text" value={currentUser} disabled
                    className="w-full rounded-2xl border border-gray-100 bg-gray-100 px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your username"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100" />
                </div>
              </div>
              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {success && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
              <button onClick={handleSaveProfile} disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </>
          )}

          {tab === "password" && (
            <>
              <div className="rounded-3xl bg-white p-4 shadow-sm space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Current Password</label>
                  <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100" />
                </div>
              </div>
              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {success && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
              <button onClick={handleResetPassword} disabled={saving}
                className="w-full rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                {saving ? "Updating..." : "Update Password"}
              </button>
            </>
          )}

          {tab === "account" && (
            <>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Account Status</h3>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleBadgeColor}`}>
                    {role}
                  </span>
                  <span className="text-xs text-gray-500">
                    {role === "explorer" && "Explorer - standard account"}
                    {role === "expert" && "Expert - enhanced access"}
                    {role === "admin" && "Admin - full access"}
                  </span>
                </div>
              </div>

              {role === "explorer" && (
                <div className="rounded-3xl bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Become an Expert</h3>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                        Expert accounts can leave detailed ingredient analyses and flag products for review. Upgrade your account to unlock these features.
                      </p>
                    </div>
                  </div>
                  {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                  {success && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
                  <button onClick={handleRequestExpert} disabled={requesting}
                    className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                    {requesting ? "Upgrading..." : "Upgrade to Expert"}
                  </button>
                </div>
              )}

              {role !== "explorer" && (
                <div className="rounded-3xl bg-white p-4 shadow-sm text-center">
                  <p className="text-sm text-gray-500">
                    {role === "expert" ? "You already have Expert status." : "You have Admin access."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}