const pricingService = require("../services/pricingService");
const { calculateMarketAdjustment } = require("../services/marketPricingService");

function calculateBasePrice(req, res) {
    try {
        const { rawMaterialCost, labourHours, region } = req.body;

        const result = pricingService.calculateBasePrice(
            rawMaterialCost,
            labourHours,
            region
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

function calculateSuggestedPrice(req, res) {
    try {
        const {
            rawMaterialCost,
            labourHours,
            region,
            marketAdjustment
        } = req.body;

        const result = pricingService.calculateSuggestedPrice(
            rawMaterialCost,
            labourHours,
            region,
            marketAdjustment || 0
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

function calculateMarketPriceAdjustment(req, res) {
    try {
        const result = calculateMarketAdjustment(req.body);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    calculateBasePrice,
    calculateSuggestedPrice,
    calculateMarketPriceAdjustment
};