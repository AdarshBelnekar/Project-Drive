const express = require("express");
const { createFolder, getFolders } = require("../controllers/folderController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);

module.exports = router;
