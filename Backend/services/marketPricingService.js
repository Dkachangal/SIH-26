function calculateMarketAdjustment({
    demandLevel,
    seasonality,
    competitorPrice,
    basePrice
}) {
    let adjustment = 0;

    // Demand based adjustment
    if (demandLevel === "high") {
        adjustment += basePrice * 0.15;
    } else if (demandLevel === "low") {
        adjustment -= basePrice * 0.10;
    }

    // Seasonal adjustment
    if (seasonality === "festival") {
        adjustment += basePrice * 0.10;
    }

    // Competitor price adjustment
    if (competitorPrice && competitorPrice > basePrice) {
        adjustment += (competitorPrice - basePrice) * 0.30;
    }

    return Math.round(adjustment);
}

module.exports = {
    calculateMarketAdjustment
};