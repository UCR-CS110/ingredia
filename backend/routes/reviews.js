const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

router.post("/", async (req, res) => {
  const { productId, productName, userEmail, rating, comment } = req.body;
  try {
    const review = await Review.create({
      productId,
      productName,
      userEmail,
      rating,
      comment,
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:reviewId", async (req, res) => {
  const { userEmail, rating, comment } = req.body;
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userEmail !== userEmail)
      return res.status(403).json({ error: "Not authorized" });
    const updated = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating, comment },
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:reviewId", async (req, res) => {
  const { userEmail, isAdmin, reason } = req.body;
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (!isAdmin && review.userEmail !== userEmail)
      return res.status(403).json({ error: "Not authorized" });
    // reason optional for admin deletes from product modal
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: "Review deleted", reason: reason || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all reviews
router.get("/admin/all", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort(
      { createdAt: -1 },
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
