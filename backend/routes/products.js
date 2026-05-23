const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", async (req, res) => {
  const { q } = req.query;
  const search = q || "organic";

  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(search)}&page_size=20&fields=product_name,brands,categories,image_front_url,ingredients_text,labels_tags`,
  );
  const data = await response.json();

  const products = (data.products || [])
    .filter(
      (p) => p.product_name && /^[a-zA-Z0-9\s,.\-'&()]+$/.test(p.product_name),
    )
    .map((p, i) => ({
      _id: i,
      name: p.product_name,
      brand: p.brands,
      category: p.categories?.split(",")[0] || "food",
      image: p.image_front_url,
      ingredients_raw: p.ingredients_text,
      dietary_tags: p.labels_tags || [],
    }));

  res.json(products);
});

module.exports = router;
