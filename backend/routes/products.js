const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    brand: String,
    category: String,
    image: String,
    ingredients_raw: String,
    score: Number,
    negatives: Array,
    positives: Array,
  }),
);

router.get("/", async (req, res) => {
  const { q } = req.query;

  try {
    let query = {};
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      query = {
        $or: [{ name: regex }, { brand: regex }, { ingredients_raw: regex }],
      };
    }

    const products = await Product.find(query).limit(20).lean();

    res.json(
      products.map((p) => ({
        _id: String(p._id),
        name: p.name,
        brand: p.brand,
        category: p.category,
        image: p.image,
        ingredients_raw: p.ingredients_raw,
        score: p.score,
        negatives: p.negatives,
        positives: p.positives,
      })),
    );
  } catch (err) {
    console.error("products route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
