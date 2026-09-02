function generateBusinessSummary(summary, pendingOrders, completedOrders, topProduct) {
    const {
        totalSales,
        totalOrders,
        averageOrderValue
    } = summary;

    let message = "";

    message += `Your total sales are ₹${totalSales}. `;

    message += `You have received ${totalOrders} orders. `;

    message += `${completedOrders} orders are completed and ${pendingOrders} orders are pending. `;

    message += `Your average order value is ₹${Math.round(averageOrderValue)}. `;

    if (topProduct && topProduct.productId) {
        message += `Your top selling product is ${topProduct.productId}, with ${topProduct.quantitySold} units sold.`;
    }

    return message;
}

module.exports = {
    generateBusinessSummary
};