const { generateBusinessDashboard } = require("./businessDashboardService");
const { generateBusinessSummary } = require("./voiceSummaryService");

function generateVoiceBusinessSummary(orders) {
    const dashboard = generateBusinessDashboard(orders);

    const message = generateBusinessSummary(
        dashboard.sales,
        dashboard.orders.pending,
        dashboard.orders.completed,
        dashboard.topProduct
    );

    return {
        message,
        dashboard
    };
}

module.exports = {
    generateVoiceBusinessSummary
};