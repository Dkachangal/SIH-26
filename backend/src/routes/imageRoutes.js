const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadAndEnhanceImages } = require("../controllers/imageController");

const router = express.Router();

// CRITICAL FIX: Replace upload.array("images", 10) with upload.any()
router.post("/upload", upload.any(), uploadAndEnhanceImages);

module.exports = router;