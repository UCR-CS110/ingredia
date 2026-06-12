const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const ADDITIVES_TO_AVOID = [
  "high fructose corn syrup",
  "aspartame",
  "saccharin",
  "sucralose",
  "sodium nitrate",
  "sodium nitrite",
  "bha",
  "bht",
  "tbhq",
  "carrageenan",
  "monosodium glutamate",
  "msg",
  "artificial flavor",
  "artificial colour",
  "artificial color",
  "red 40",
  "yellow 5",
  "yellow 6",
  "blue 1",
  "blue 2",
  "titanium dioxide",
  "brominated vegetable oil",
  "potassium bromate",
  "propyl gallate",
];

function isEnglish(str) {
  if (!str) return false;
  return /^[a-zA-Z0-9\s,.\-'&()/!%+*#@]+$/.test(str);
}

function analyzeIngredients(ingredients_raw) {
  if (!ingredients_raw) return { score: 50, negatives: [], positives: [] };

  const raw = ingredients_raw.toLowerCase();
  const ingredientList = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let score = 100;
  const negatives = [];
  const positives = [];

  // Check sugar
  const sugarMatch = raw.match(/sugar[^,]*/);
  if (sugarMatch) {
    score -= 15;
    negatives.push({
      icon: "droplets",
      label: "Sugar",
      value: "Contains added sugar",
      severity: "high",
    });
  }

  // Check additives
  const foundAdditives = ADDITIVES_TO_AVOID.filter((a) => raw.includes(a));
  if (foundAdditives.length > 0) {
    score -= foundAdditives.length * 10;
    negatives.push({
      icon: "plus",
      label: "Additives",
      value: `Contains additives to avoid`,
      severity: "high",
    });
  }

  // Check sodium
  if (raw.includes("sodium") || raw.includes("salt")) {
    score -= 8;
    negatives.push({
      icon: "wheat",
      label: "Sodium",
      value: "Contains sodium/salt",
      severity: "medium",
    });
  }

  // Positives
  if (
    raw.includes("protein") ||
    raw.includes("whey") ||
    raw.includes("soy protein")
  ) {
    positives.push({
      icon: "droplets",
      label: "Protein",
      value: "Good source of protein",
    });
  }
  if (
    raw.includes("fiber") ||
    raw.includes("fibre") ||
    raw.includes("oat") ||
    raw.includes("whole grain")
  ) {
    positives.push({
      icon: "wheat",
      label: "Fiber",
      value: "Contains dietary fiber",
    });
  }
  if (
    raw.includes("vitamin") ||
    raw.includes("calcium") ||
    raw.includes("iron")
  ) {
    positives.push({
      icon: "droplets",
      label: "Vitamins",
      value: "Contains vitamins & minerals",
    });
  }
  if (ingredientList.length <= 5) {
    positives.push({
      icon: "droplets",
      label: "Simple ingredients",
      value: `Only ${ingredientList.length} ingredients`,
    });
  }

  score = Math.max(5, Math.min(100, score));
  return { score, negatives, positives };
}

router.get("/", async (req, res) => {
  const { q } = req.query;
  const search = q || "organic";

  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(search)}&page_size=30&fields=product_name,brands,categories,image_front_url,ingredients_text,nutriments,labels_tags&language=en&lc=en`,
  );
  const data = await response.json();

  const products = (data.products || [])
    .filter(
      (p) =>
        p.product_name &&
        isEnglish(p.product_name) &&
        isEnglish(p.brands || "x") &&
        p.ingredients_text &&
        isEnglish(p.ingredients_text),
    )
    .slice(0, 20)
    .map((p, i) => {
      const { score, negatives, positives } = analyzeIngredients(
        p.ingredients_text,
      );
      return {
        _id: String(i),
        name: p.product_name,
        brand: p.brands || "",
        category: p.categories?.split(",")[0]?.trim() || "Food",
        image: p.image_front_url || "",
        ingredients_raw: p.ingredients_text,
        score,
        negatives,
        positives,
        dietary_tags: p.labels_tags || [],
      };
    });

  res.json(products);
});

module.exports = router;
