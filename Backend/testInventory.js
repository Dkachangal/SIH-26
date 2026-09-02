const {
    checkInventoryStatus,
    updateStock,
    addStock
} = require("./services/inventoryService");

const inventory = {
    stockQuantity: 3,
    lowStockThreshold: 5,

    rawMaterialQuantity: 10,
    rawMaterialThreshold: 5
};

console.log("Inventory Status:");
console.log(checkInventoryStatus(inventory));

console.log("After selling 2 items:");
console.log(updateStock(inventory.stockQuantity, 2));

console.log("After adding 5 items:");
console.log(addStock(inventory.stockQuantity, 5));