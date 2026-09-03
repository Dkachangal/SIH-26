const inventoryService = require("../services/inventoryManagementService");

async function getInventory(req, res) {
    try {
        const inventory = await inventoryService.getInventory(
            req.params.productId
        );

        res.status(200).json(inventory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function increaseStock(req, res) {
    try {
        const inventory = await inventoryService.increaseStock(
            req.params.productId,
            req.body.quantity
        );

        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function decreaseStock(req, res) {
    try {
        const inventory = await inventoryService.decreaseStock(
            req.params.productId,
            req.body.quantity
        );

        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function setStock(req, res) {
    try {
        const inventory = await inventoryService.setStock(
            req.params.productId,
            req.body.quantity
        );

        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateRawMaterial(req, res) {
    try {
        const inventory = await inventoryService.updateRawMaterial(
            req.params.productId,
            req.body.quantity
        );

        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function adjustRawMaterial(req, res) {
    try {
        const inventory = await inventoryService.adjustRawMaterial(
            req.params.productId,
            req.body.quantity
        );

        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getLowStockItems(req, res) {
    try {
        const inventories = await inventoryService.getLowStockItems();

        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getInventory,
    increaseStock,
    decreaseStock,
    setStock,
    updateRawMaterial,
    adjustRawMaterial,
    getLowStockItems
};