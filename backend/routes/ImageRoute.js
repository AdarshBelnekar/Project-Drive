const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const Image = require("../models/Image");

const router = express.Router();

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// ✅ File Type Validation
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// ✅ Upload Image Route
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, folderId } = req.body;

    // Generate full URL for image
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Save to DB
    const image = await Image.create({
      name,
      imageUrl,
      folderId,
      userId: req.user,
    });

    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get All Images (Optional for testing)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Images by Folder
router.get("/folder/:id", authMiddleware, async (req, res) => {
  try {
    const images = await Image.find({
      userId: req.user,
      folderId: req.params.id,
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Search Image by Name
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;
    const images = await Image.find({
      userId: req.user,
      name: { $regex: name, $options: "i" },
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
