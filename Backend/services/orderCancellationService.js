const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const { restoreStock } = require("./inventoryService");
const { createOrderStatusNotification } = require("./orderNotificationService");

async function cancelOrder(orderId) {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.status === "cancelled") {
        throw new Error("Order is already cancelled");
    }

    if (order.status === "shipped" || order.status === "delivered") {
        throw new Error("Cannot cancel shipped or delivered order");
    }

    // Restore stock for every product
    for (const item of order.items) {
        const inventory = await Inventory.findOne({
            product: item.product
        });

        if (!inventory) {
            throw new Error(
                `Inventory not found for product ${item.product}`
            );
        }

        inventory.stockQuantity = restoreStock(
            inventory.stockQuantity,
            item.quantity
        );

        await inventory.save();
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    // Notify buyer
    await createOrderStatusNotification(
        order.buyer,
        order._id,
        "cancelled"
    );

    return order;
}

module.exports = {
    cancelOrder
};