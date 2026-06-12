const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Simple CSV parser
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/\r/g, ""));

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r/g, "");
    if (!line.trim()) continue;

    // Handle quoted fields
    const fields = [];
    let current = "";
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"') {
        inQuotes = !inQuotes;
      } else if (line[c] === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += line[c];
      }
    }
    fields.push(current.trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = fields[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

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
  "artificial color",
  "red 40",
  "yellow 5",
  "yellow 6",
  "blue 1",
  "blue 2",
  "titanium dioxide",
  "potassium bromate",
];

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

  if (raw.includes("sugar")) {
    score -= 15;
    negatives.push({
      icon: "droplets",
      label: "Sugar",
      value: "Contains added sugar",
      severity: "high",
    });
  }
  const foundAdditives = ADDITIVES_TO_AVOID.filter((a) => raw.includes(a));
  if (foundAdditives.length > 0) {
    score -= foundAdditives.length * 10;
    negatives.push({
      icon: "plus",
      label: "Additives",
      value: "Contains additives to avoid",
      severity: "high",
    });
  }
  if (raw.includes("sodium") || raw.includes("salt")) {
    score -= 8;
    negatives.push({
      icon: "wheat",
      label: "Sodium",
      value: "Contains sodium/salt",
      severity: "medium",
    });
  }
  if (raw.includes("protein") || raw.includes("whey")) {
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

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  image: String,
  ingredients_raw: String,
  score: Number,
  negatives: Array,
  positives: Array,
});

const Product = mongoose.model("Product", productSchema);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  console.log("Cleared existing products");

  const rows = parseCSV(path.join(__dirname, "ingredients_data.csv"));
  console.log(`Parsed ${rows.length} rows from CSV`);

  const products = rows
    .filter(
      (r) =>
        r.name &&
        r["features.key"] === "Ingredients" &&
        r["features.value"] &&
        /^[a-zA-Z0-9\s,.\-'&()/!%+*#@]+$/.test(r.name),
    )
    .map((r) => {
      const { score, negatives, positives } = analyzeIngredients(
        r["features.value"],
      );
      return {
        name: r.name,
        brand: r.brand || "",
        category: r.categories?.split(",")[0]?.trim() || "Food",
        image: "",
        ingredients_raw: r["features.value"],
        score,
        negatives,
        positives,
      };
    });

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products into MongoDB`);
  mongoose.disconnect();
}

seed().catch(console.error);
