const express = require("express");
const router = express.Router();

const {
    calculateBasePrice,
    calculateSuggestedPrice,
    calculateMarketPriceAdjustment
} = require("../controllers/pricingController");

router.post("/base-price", calculateBasePrice);

router.post("/suggested-price", calculateSuggestedPrice);

router.post("/market-adjustment", calculateMarketPriceAdjustment);

module.exports = router;