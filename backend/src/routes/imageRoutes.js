const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
    uploadAndEnhanceImages
} = require("../controllers/imageController");

const router = express.Router();

router.post(
    "/upload",
    upload.array("images", 10),
    uploadAndEnhanceImages
);

module.exports = router;