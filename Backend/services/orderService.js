const { createOrderStatusNotification } = require("./orderNotificationService");
const { prepareOrderWorkflow } = require("./orderWorkflowService");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
async function createOrder(
    buyerId,
    items,
    shippingAddress,
    inventoryItems
) {
    if (!buyerId) {
        throw new Error("Buyer is required");
    }

    if (!items || items.length === 0) {
        throw new Error("Order must contain at least one product");
    }

    if (!inventoryItems || inventoryItems.length === 0) {
        throw new Error("Inventory information is required");
    }

    let totalAmount = 0;

    for (const item of items) {
        if (item.quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }

        if (item.price < 0) {
            throw new Error("Price cannot be negative");
        }

        totalAmount += item.price * item.quantity;
    }

    // Check and prepare stock reservation
    const stockUpdates = prepareOrderWorkflow(
        items,
        inventoryItems
    );
    for (const update of stockUpdates.stockUpdates) {
    const inventory = await Inventory.findOne({
        product: update.productId
    });

    if (!inventory) {
        throw new Error(
            `Inventory not found for product ${update.productId}`
        );
    }

    inventory.stockQuantity = update.newStock;
    await inventory.save();
}
    // Create order only after stock validation succeeds
    const order = await Order.create({
        buyer: buyerId,
        items,
        totalAmount,
        shippingAddress
    });

    return {
        order,
        stockUpdates
    };
}


async function getOrderById(orderId) {
    const order = await Order.findById(orderId)
        .populate("buyer", "name email")
        .populate("items.product");

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
}

async function updateOrderStatus(orderId, newStatus) {
    const validTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: []
    };

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const currentStatus = order.status;

    if (!validTransitions[currentStatus].includes(newStatus)) {
        throw new Error(
            `Cannot change order status from ${currentStatus} to ${newStatus}`
        );
    }

    order.status = newStatus;

    await order.save();

    // Create notification for buyer
    await createOrderStatusNotification(
        order.buyer,
        order._id,
        newStatus
    );

    return order;
}

module.exports = {
    createOrder,
    getOrderById,
    updateOrderStatus
};