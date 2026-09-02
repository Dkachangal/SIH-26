const { getRegionalWage } = require("./wageService");

function calculateBasePrice(rawMaterialCost, labourHours, region) {
    if (rawMaterialCost < 0 || labourHours < 0) {
        throw new Error("Cost and labour hours cannot be negative");
    }

    const regionalWage = getRegionalWage(region);

    const labourCost = labourHours * regionalWage;
    const basePrice = rawMaterialCost + labourCost;

    return {
        rawMaterialCost,
        labourHours,
        region,
        regionalWage,
        labourCost,
        basePrice
    };
}

function calculateSuggestedPrice(
    rawMaterialCost,
    labourHours,
    region,
    marketAdjustment = 0
) {
    const pricing = calculateBasePrice(
        rawMaterialCost,
        labourHours,
        region
    );

    const costFloor = pricing.basePrice;

    const suggestedPrice = Math.max(
        costFloor,
        costFloor + marketAdjustment
    );

    return {
        ...pricing,
        costFloor,
        marketAdjustment,
        suggestedPrice
    };
}

module.exports = {
    calculateBasePrice,
    calculateSuggestedPrice
};