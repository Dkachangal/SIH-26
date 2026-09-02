const {
    checkInventoryStatus
} = require("./inventoryService");

const {
    createNotification
} = require("./notificationService");


async function checkAndCreateInventoryNotifications(
    inventory,
    userId
) {
    const status = checkInventoryStatus(inventory);

    const notifications = [];

    if (inventory.stockQuantity <= inventory.lowStockThreshold) {
        const notification = await createNotification(
            userId,
            "LOW_STOCK",
            `Product stock is low. Current stock: ${inventory.stockQuantity}`
        );

        notifications.push(notification);
    }

    if (
        inventory.rawMaterialQuantity <=
        inventory.rawMaterialThreshold
    ) {
        const notification = await createNotification(
            userId,
            "RAW_MATERIAL_LOW",
            `Raw material stock is low. Current quantity: ${inventory.rawMaterialQuantity}`
        );

        notifications.push(notification);
    }

    return {
        status,
        notifications
    };
}

module.exports = {
    checkAndCreateInventoryNotifications
};