const {
    generateBusinessSummary
} = require("./services/voiceSummaryService");

const summary = {
    totalSales: 3000,
    totalOrders: 3,
    averageOrderValue: 1000
};

const pendingOrders = 1;
const completedOrders = 2;

const topProduct = {
    productId: "weaving",
    quantitySold: 8
};

const message = generateBusinessSummary(
    summary,
    pendingOrders,
    completedOrders,
    topProduct
);

console.log(message);