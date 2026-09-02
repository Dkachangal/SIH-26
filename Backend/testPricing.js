const {
    calculateBasePrice,
    calculateSuggestedPrice
} = require("./services/pricingService");

const result = calculateSuggestedPrice(
    800,              // raw material cost
    10,               // labour hours
    "Uttar Pradesh",  // region
    400               // market adjustment
);

console.log(result);