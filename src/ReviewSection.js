import React, { useState } from "react";

export function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  function addReview() {
    if (!text.trim()) return;
    setReviews([...reviews, { id: Date.now(), user: "Demo User", text }]);
    setText("");
  }

  return (
    <div className="mt-5 border-t pt-4">
      <h4 className="font-bold mb-2">Reviews</h4>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-100 rounded-lg px-3 py-2"
          placeholder="Write a review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={addReview} className="bg-gray-900 text-white px-4 rounded-lg">
          Post
        </button>
      </div>

      {reviews.map((r) => (
        <div key={r.id} className="bg-gray-50 p-3 mt-2 rounded-lg">
          <p className="font-semibold">{r.user}</p>
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  );
}