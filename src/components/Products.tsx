import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";

interface Review {
  _id: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: string | number;
  name: string;
  brand: string;
  image: string;
  score: number;
  ingredients?: string[];
}

interface ProductsProps {
  product: Product | null;
  currentUser: string;
  onClose: () => void;
}

export function Products({ product, currentUser, onClose }: ProductsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    fetch(`http://localhost:5000/api/reviews/${product.id}`)
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [product]);

  if (!product) return null;

  async function handleSubmit() {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: String(product!.id),
          productName: product!.name,
          userEmail: currentUser,
          rating,
          comment,
        }),
      });
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setComment("");
      setRating(5);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-gray-50">
          {product.ingredients && product.ingredients.length > 0 && (
            <section className="rounded-3xl bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Ingredients</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{product.ingredients.join(", ")}</p>
            </section>
          )}

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Leave a Review</h3>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star className={`h-6 w-6 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts on this product..."
              className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !comment.trim()}
              className="mt-2 w-full rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
            ) : (
              reviews.map(r => (
                <div key={r._id} className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-700">{r.userEmail}</p>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}