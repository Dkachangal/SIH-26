const express = require("express");

const {
  generateProductCatalog
} = require("../controllers/aiCatalogController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/catalog/:productId",
  protect,
  generateProductCatalog
);

module.exports = router;