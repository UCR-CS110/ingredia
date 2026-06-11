const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Product reviews
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

// Post reviews
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

module.exports = router;
