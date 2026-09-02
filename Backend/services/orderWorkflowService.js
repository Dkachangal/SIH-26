const {
    reserveOrderItems
} = require("./orderInventoryService");

const {
    checkInventoryStatus
} = require("./inventoryService");


function prepareOrderWorkflow(orderItems, inventoryItems) {

    // Step 1: Check and reserve stock
    const stockUpdates = reserveOrderItems(
        inventoryItems,
        orderItems
    );

    // Step 2: Check resulting inventory
    const inventoryAlerts = [];

    for (const update of stockUpdates) {

        const inventory = inventoryItems.find(
            item =>
                item.productId.toString() ===
                update.productId.toString()
        );

        const updatedInventory = {
            ...inventory,
            stockQuantity: update.newStock
        };

        const status = checkInventoryStatus(
            updatedInventory
        );

        if (status.isLowStock) {
            inventoryAlerts.push({
                productId: update.productId,
                alerts: status.alerts
            });
        }
    }

    return {
        stockUpdates,
        inventoryAlerts
    };
}


module.exports = {
    prepareOrderWorkflow
};