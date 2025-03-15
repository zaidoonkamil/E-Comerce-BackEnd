const express = require("express");
const Ads = require("../models/ads");
const router = express.Router();
const upload = require("../middlewares/uploads");

router.post("/ads",upload.array("images",5) , async (req, res) => {
    const { name } = req.body;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const images = req.files.map(file => file.filename);
        const ads = await Ads.create({
            images,
        });

        res.status(201).json({ message: "ads created successfully", ads });
    } catch (err) {
        console.error("❌ Error creating ads:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/ads", async (req, res) => {
    try{
    const ads = await Ads.findAll();
    res.json(ads);
} catch (err) {
    console.error("❌ Error creating ads:", err);
    res.status(500).json({ error: "Internal Server Error" });
}
});

module.exports = router;
