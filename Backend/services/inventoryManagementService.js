const Inventory = require("../models/Inventory");

async function getInventory(productId) {
    const inventory = await Inventory.findOne({
        product: productId
    });

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return inventory;
}

async function increaseStock(productId, quantity) {
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const inventory = await getInventory(productId);

    inventory.stockQuantity += quantity;

    await inventory.save();

    return inventory;
}
async function setStock(productId, quantity) {
    if (quantity < 0) {
        throw new Error("Stock quantity cannot be negative");
    }

    const inventory = await getInventory(productId);

    inventory.stockQuantity = quantity;

    await inventory.save();

    return inventory;
}
async function decreaseStock(productId, quantity) {
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const inventory = await getInventory(productId);

    if (quantity > inventory.stockQuantity) {
        throw new Error("Insufficient stock");
    }

    inventory.stockQuantity -= quantity;

    await inventory.save();

    return inventory;
}

async function updateRawMaterial(productId, quantity) {
    if (quantity < 0) {
        throw new Error("Raw material quantity cannot be negative");
    }

    const inventory = await getInventory(productId);

    inventory.rawMaterialQuantity = quantity;

    await inventory.save();

    return inventory;
}
async function adjustRawMaterial(productId, quantity) {
    const inventory = await getInventory(productId);

    const newQuantity = inventory.rawMaterialQuantity + quantity;

    if (newQuantity < 0) {
        throw new Error("Insufficient raw material");
    }

    inventory.rawMaterialQuantity = newQuantity;

    await inventory.save();

    return inventory;
}
async function getLowStockItems() {
    const inventories = await Inventory.find({
        $or: [
            {
                $expr: {
                    $lte: ["$stockQuantity", "$lowStockThreshold"]
                }
            },
            {
                $expr: {
                    $lte: [
                        "$rawMaterialQuantity",
                        "$rawMaterialThreshold"
                    ]
                }
            }
        ]
    });

    return inventories;
}
module.exports = {
    getInventory,
    increaseStock,
    setStock,
    decreaseStock,
    updateRawMaterial,
    adjustRawMaterial,
    getLowStockItems
};