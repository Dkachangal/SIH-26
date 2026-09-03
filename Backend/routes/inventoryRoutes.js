const express = require("express");
const router = express.Router();

const {
    getInventory,
    increaseStock,
    decreaseStock,
    setStock,
    updateRawMaterial,
    adjustRawMaterial,
    getLowStockItems
} = require("../controllers/inventoryController");

router.get("/low-stock", getLowStockItems);

router.get("/:productId", getInventory);

router.patch("/:productId/increase", increaseStock);

router.patch("/:productId/decrease", decreaseStock);

router.patch("/:productId/set", setStock);

router.patch("/:productId/raw-material", updateRawMaterial);

router.patch("/:productId/raw-material/adjust", adjustRawMaterial);

module.exports = router;