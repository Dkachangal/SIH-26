function checkInventoryStatus(inventory) {
    const alerts = [];

    if (inventory.stockQuantity <= inventory.lowStockThreshold) {
        alerts.push("Product stock is low");
    }

    if (
        inventory.rawMaterialQuantity <=
        inventory.rawMaterialThreshold
    ) {
        alerts.push("Raw material stock is low");
    }

    return {
        isLowStock: alerts.length > 0,
        alerts
    };
}

function updateStock(currentStock, quantitySold) {
    if (quantitySold < 0) {
        throw new Error("Quantity sold cannot be negative");
    }

    if (quantitySold > currentStock) {
        throw new Error("Insufficient stock");
    }

    return currentStock - quantitySold;
}

function addStock(currentStock, quantityAdded) {
    if (quantityAdded < 0) {
        throw new Error("Quantity added cannot be negative");
    }

    return currentStock + quantityAdded;
}
function reserveStock(currentStock, quantity) {
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    if (quantity > currentStock) {
        throw new Error("Insufficient stock");
    }

    return currentStock - quantity;
}


function restoreStock(currentStock, quantity) {
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    return currentStock + quantity;
}
module.exports = {
    checkInventoryStatus,
    updateStock,
    addStock,
     reserveStock,
    restoreStock

};