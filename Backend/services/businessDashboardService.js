const { checkInventoryStatus } = require("./inventoryService");
const {
    getSalesSummary,
    calculatePendingOrders,
    calculateCompletedOrders,
    getTopSellingProduct,
    calculateCancelledOrders,
    calculateSalesByDate,
    calculateProductSales,
    calculateMonthlySales,
    calculateOrdersByStatus
} = require("./salesAnalyticsService");

function generateBusinessDashboard(orders, inventoryItems = []) {
    const salesSummary = getSalesSummary(orders);

    const pendingOrders = calculatePendingOrders(orders);

    const completedOrders = calculateCompletedOrders(orders);

    const topSellingProduct = getTopSellingProduct(orders);

    const inventoryAlerts = [];

for (const inventory of inventoryItems) {
    const status = checkInventoryStatus(inventory);

    if (status.isLowStock) {
        inventoryAlerts.push({
            productId: inventory.productId || inventory.product,
            alerts: status.alerts
        });
    }
}

    const cancelledOrders = calculateCancelledOrders(orders);
    const salesByDate = calculateSalesByDate(orders);
const productSales = calculateProductSales(orders);
const monthlySales = calculateMonthlySales(orders);
const ordersByStatus = calculateOrdersByStatus(orders);
    return {
        sales: {
            totalSales: salesSummary.totalSales,
            totalOrders: salesSummary.totalOrders,
            averageOrderValue: salesSummary.averageOrderValue,
            salesByDate,
    monthlySales,
    productSales
        },

        orders: {
            pending: pendingOrders,
            completed: completedOrders,
            cancelled: cancelledOrders,
            byStatus: ordersByStatus
        },
        inventory: {
    lowStockItems: inventoryAlerts.length,
    alerts: inventoryAlerts
},
        topProduct: topSellingProduct
    };
}

module.exports = {
    generateBusinessDashboard
};