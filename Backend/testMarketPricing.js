const {
    calculateMarketAdjustment
} = require("./services/marketPricingService");

const adjustment = calculateMarketAdjustment({
    demandLevel: "high",
    seasonality: "festival",
    competitorPrice: 2000,
    basePrice: 1300
});

console.log("Market Adjustment:", adjustment);