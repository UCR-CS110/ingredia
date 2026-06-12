import { useState, useEffect } from "react";
import { X, Users, User, Star, Trash2 } from "lucide-react";

interface UserRecord {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface ReviewRecord {
  _id: string;
  productName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
}

const REASONS = [
  "Spam or advertising",
  "Inappropriate content",
  "Misinformation",
  "Offensive language",
  "Other",
];

export function Dashboard({ isOpen, onClose, currentUser }: DashboardProps) {
  const [tab, setTab] = useState<"users" | "reviews">("users");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setLoadingUsers(true);
    fetch("http://localhost:5000/api/auth/users")
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || tab !== "reviews") return;
    setLoadingReviews(true);
    fetch("http://localhost:5000/api/reviews/admin/all")
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReviews = reviews.filter(r =>
    r.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    r.productName?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAdminDelete(reviewId: string) {
    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) return;
    try {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUser, isAdmin: true, reason: finalReason }),
      });
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      setDeletingId(null);
      setReason("");
      setCustomReason("");
    } catch {}
  }

  const roleBadge = (role: string) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "expert") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-xs text-gray-500">{users.length} users · {reviews.length} reviews</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["users", "reviews"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setSearch(""); }}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition ${tab === t ? "border-b-2 border-purple-600 text-purple-700" : "text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Stats (users tab) */}
        {tab === "users" && (
          <div className="grid grid-cols-3 gap-3 border-b border-gray-100 px-5 py-3">
            {[
              { label: "Explorers", count: users.filter(u => !u.role || u.role === "explorer").length, color: "text-green-700" },
              { label: "Experts", count: users.filter(u => u.role === "expert").length, color: "text-blue-700" },
              { label: "Admins", count: users.filter(u => u.role === "admin").length, color: "text-purple-700" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100">
          <input type="text" placeholder={tab === "users" ? "Search users..." : "Search reviews..."}
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100" />
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 px-5 py-4 space-y-3">
          {tab === "users" && (
            loadingUsers ? (
              <p className="text-center text-sm text-gray-400 py-8">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No users found.</p>
            ) : filteredUsers.map(u => (
              <div key={u._id} className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.name || "—"}</p>
                      <p className="text-xs text-gray-500">@{u.username || "—"}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleBadge(u.role)}`}>
                    {u.role || "explorer"}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p>Profile{u.email}</p>
                  <p>{u.phone || "—"}</p>
                  <p>📅 Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}

          {tab === "reviews" && (
            loadingReviews ? (
              <p className="text-center text-sm text-gray-400 py-8">Loading reviews...</p>
            ) : filteredReviews.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No reviews found.</p>
            ) : filteredReviews.map(r => (
              <div key={r._id} className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{r.userEmail}</p>
                    <p className="text-xs text-gray-400">{r.productName}</p>
                    <div className="flex gap-0.5 my-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => { setDeletingId(r._id); setReason(""); setCustomReason(""); }}
                    className="shrink-0 text-gray-400 hover:text-red-500 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Inline reason picker */}
                {deletingId === r._id && (
                  <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                    <p className="text-xs font-semibold text-gray-700">Select a reason for deletion:</p>
                    <div className="flex flex-wrap gap-2">
                      {REASONS.map(opt => (
                        <button key={opt} onClick={() => setReason(opt)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${reason === opt ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {reason === "Other" && (
                      <input type="text" value={customReason} onChange={e => setCustomReason(e.target.value)}
                        placeholder="Describe the reason..."
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-red-300" />
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => handleAdminDelete(r._id)}
                        disabled={!reason || (reason === "Other" && !customReason.trim())}
                        className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:bg-red-700">
                        Confirm Delete
                      </button>
                      <button onClick={() => setDeletingId(null)}
                        className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}