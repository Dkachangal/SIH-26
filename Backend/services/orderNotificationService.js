const { createNotification } = require("./notificationService");

async function createOrderStatusNotification(
    buyerId,
    orderId,
    status
) {
    const messages = {
        confirmed: "Your order has been confirmed.",
        processing: "Your order is now being processed.",
        shipped: "Your order has been shipped.",
        delivered: "Your order has been delivered.",
        cancelled: "Your order has been cancelled."
    };

    const message = messages[status];

    if (!message) {
        throw new Error("Invalid order status for notification");
    }

    return await createNotification(
        buyerId,
        "ORDER_UPDATE",
        `${message} Order ID: ${orderId}`
    );
}

module.exports = {
    createOrderStatusNotification
};