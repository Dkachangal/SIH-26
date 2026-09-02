const { reserveStock, restoreStock } = require("./inventoryService");

function reserveOrderItems(inventoryItems, orderItems) {
    const requiredQuantity = {};

    // Step 1: Calculate total quantity required for each product
    for (const orderItem of orderItems) {
        const productId = orderItem.product.toString();

        if (!requiredQuantity[productId]) {
            requiredQuantity[productId] = 0;
        }

        requiredQuantity[productId] += orderItem.quantity;
    }

    // Step 2: Check ALL products before making any reservation
    for (const productId in requiredQuantity) {
        const inventory = inventoryItems.find(
            item => item.productId.toString() === productId
        );

        if (!inventory) {
            throw new Error(
                `Inventory not found for product ${productId}`
            );
        }

        if (requiredQuantity[productId] > inventory.stockQuantity) {
            throw new Error(
                `Insufficient stock for product ${productId}`
            );
        }
    }

    // Step 3: Now reserve stock
    const updatedInventory = [];

    for (const productId in requiredQuantity) {
        const inventory = inventoryItems.find(
            item => item.productId.toString() === productId
        );

        const quantity = requiredQuantity[productId];

        const newStock = reserveStock(
            inventory.stockQuantity,
            quantity
        );

        updatedInventory.push({
            productId: inventory.productId,
            oldStock: inventory.stockQuantity,
            reservedQuantity: quantity,
            newStock
        });
    }

    return updatedInventory;
}


function restoreOrderItems(inventoryItems, orderItems) {
    const requiredQuantity = {};

    // Calculate total quantity to restore for each product
    for (const orderItem of orderItems) {
        const productId = orderItem.product.toString();

        if (!requiredQuantity[productId]) {
            requiredQuantity[productId] = 0;
        }

        requiredQuantity[productId] += orderItem.quantity;
    }

    const updatedInventory = [];

    for (const productId in requiredQuantity) {
        const inventory = inventoryItems.find(
            item => item.productId.toString() === productId
        );

        if (!inventory) {
            throw new Error(
                `Inventory not found for product ${productId}`
            );
        }

        const quantity = requiredQuantity[productId];

        const newStock = restoreStock(
            inventory.stockQuantity,
            quantity
        );

        updatedInventory.push({
            productId: inventory.productId,
            oldStock: inventory.stockQuantity,
            restoredQuantity: quantity,
            newStock
        });
    }

    return updatedInventory;
}


module.exports = {
    reserveOrderItems,
    restoreOrderItems
};