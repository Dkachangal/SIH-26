const express = require("express");
const router = express.Router();

const {
    getBuyer,
    getBuyerOrders,
    updateBuyerProfile
} = require("../controllers/buyerController");

router.get("/:buyerId", getBuyer);
router.get("/:buyerId/orders", getBuyerOrders);
router.put("/:buyerId", updateBuyerProfile);

module.exports = router;