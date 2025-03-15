const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const multer = require("multer");
const upload = require("../middlewares/uploads");

router.post("/products", upload.array("images", 5), async (req, res) => {
  const { title, description, price, rating, categoryId } = req.body;

  try {
    if (!title || !description || !price || !categoryId) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
  }
    const images = req.files.map(file => file.filename);
    const product = await Product.create({
      title,
      description,
      price,
      images,
      categoryId,
      rating
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: ["category"],
    });

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: ["category"], 
    });

    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    const products = await Product.findAll({
      where: { categoryId },
      include: ["category"],
    });

    if (products.length === 0) {
      return res.status(404).json({ error: "لا توجد منتجات في هذه الفئة" });
    }

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products by category:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
