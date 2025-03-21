const express = require("express");
const Category = require("../models/category");
const router = express.Router();
const multer = require("multer");
const upload = require("../middlewares/uploads");

router.post("/categories",upload.array("images",5) , async (req, res) => {
    const { name } = req.body;
    try {
        if (!name || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const images = req.files.map(file => file.filename);
        const category = await Category.create({
            name,
            images,
        });

        res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
        console.error("❌ Error creating Category:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/categories", async (req, res) => {
    try{
    const categories = await Category.findAll();
    res.json(categories);
} catch (err) {
    console.error("❌ Error creating Category:", err);
    res.status(500).json({ error: "Internal Server Error" });
}
});

router.delete("/categories/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting category:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
