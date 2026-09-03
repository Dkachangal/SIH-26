const orderService = require("../services/orderService");
const { cancelOrder } = require("../services/orderCancellationService");

async function createOrder(req, res) {
    try {
        const { buyerId, items, shippingAddress, inventoryItems } = req.body;

        const result = await orderService.createOrder(
            buyerId,
            items,
            shippingAddress,
            inventoryItems
        );

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await orderService.getOrderById(req.params.orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.orderId,
            req.body.status
        );

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function cancelExistingOrder(req, res) {
    try {
        const order = await cancelOrder(req.params.orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createOrder,
    getOrderById,
    updateOrderStatus,
    cancelExistingOrder
};