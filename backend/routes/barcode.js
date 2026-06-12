const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Jimp = require("jimp");
const {
  BrowserMultiFormatReader,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
} = require("@zxing/library");

const upload = multer({ storage: multer.memoryStorage() });

// Product model not needed - falls back to Open Food Facts API

async function decodeBarcode(buffer) {
  const image = await Jimp.read(buffer);
  const { width, height } = image.bitmap;
  const luminances = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
      luminances[y * width + x] = Math.round(
        0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b,
      );
    }
  }

  const source = new RGBLuminanceSource(luminances, width, height);
  const bitmap = new BinaryBitmap(new HybridBinarizer(source));
  const reader = new BrowserMultiFormatReader();
  const result = reader.decode(bitmap);
  return result.getText();
}

// POST /api/products/barcode/scan-image
router.post("/scan-image", upload.single("image"), async (req, res) => {
  try {
    const barcode = await decodeBarcode(req.file.buffer);
    res.json({ barcode });
  } catch (err) {
    res.status(400).json({ error: "No barcode found in image" });
  }
});

// GET /api/products/barcode/:barcode
router.get("/:barcode", async (req, res) => {
  const { barcode } = req.params;
  try {
    let product = null; // always fetch from API

    {
      const fetch = require("node-fetch");
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        { headers: { "User-Agent": "Ingredia/1.0 (contact@ingredia.app)" } },
      );
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const p = data.product;
        product = {
          _id: barcode,
          name: p.product_name || "Unknown Product",
          brand: p.brands || "",
          category: p.categories?.split(",")[0]?.trim() || "Food",
          image: p.image_front_url || "",
          ingredients_raw: p.ingredients_text || "",
        };
      }
    }

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
