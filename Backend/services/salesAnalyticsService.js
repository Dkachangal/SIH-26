function calculateTotalSales(orders) {
    return orders.reduce((total, order) => {
        if (
            order.status === "cancelled"
        ) {
            return total;
        }

        return total + order.totalAmount;
    }, 0);
}


function calculateTotalOrders(orders) {
    return orders.length;
}

function calculateAverageOrderValue(orders) {
    const validOrders = orders.filter(
        order => order.status !== "cancelled"
    );

    if (validOrders.length === 0) {
        return 0;
    }

    const totalSales = calculateTotalSales(orders);

    return totalSales / validOrders.length;
}


function getSalesSummary(orders) {
    const totalSales = calculateTotalSales(orders);
    const totalOrders = calculateTotalOrders(orders);
    const averageOrderValue = calculateAverageOrderValue(orders);

    return {
        totalSales,
        totalOrders,
        averageOrderValue
    };
}
function calculatePendingOrders(orders) {
    return orders.filter(order => {
        return order.status === "pending";
    }).length;
}


function calculateCompletedOrders(orders) {
    return orders.filter(order => order.status === "delivered").length;
}


function getTopSellingProduct(orders) {
    const productSales = {};

    for (const order of orders) {
        // Delivered orders ko completed maan rahe hain
        if (order.status !== "delivered") continue;

        for (const item of order.items) {
            const productId = item.product.toString();

            if (!productSales[productId]) {
                productSales[productId] = 0;
            }

            productSales[productId] += item.quantity;
        }
    }

    let topProduct = null;
    let highestQuantity = 0;

    for (const productId in productSales) {
        if (productSales[productId] > highestQuantity) {
            highestQuantity = productSales[productId];
            topProduct = productId;
        }
    }

    return {
        productId: topProduct,
        quantitySold: highestQuantity
    };
}
function calculateSalesByDate(orders) {
    const salesByDate = {};

    for (const order of orders) {
        if (order.status === "cancelled") continue;
        if (!order.createdAt) continue;

        const date = new Date(order.createdAt);

        if (isNaN(date.getTime())) continue;

        const dateKey = date.toISOString().split("T")[0];

        if (!salesByDate[dateKey]) {
            salesByDate[dateKey] = 0;
        }

        salesByDate[dateKey] += order.totalAmount;
    }

    return salesByDate;
}
function calculateProductSales(orders) {
    const productSales = {};

    for (const order of orders) {
        if (order.status === "cancelled") continue;

        for (const item of order.items) {
            const productId = item.product.toString();

            if (!productSales[productId]) {
                productSales[productId] = 0;
            }

            productSales[productId] += item.price * item.quantity;
        }
    }

    return productSales;
}
function calculateMonthlySales(orders) {
    const monthlySales = {};

    for (const order of orders) {
        if (order.status === "cancelled") continue;
        if (!order.createdAt) continue;

        const date = new Date(order.createdAt);

        if (isNaN(date.getTime())) continue;

        const month = date.toISOString().slice(0, 7);

        if (!monthlySales[month]) {
            monthlySales[month] = 0;
        }

        monthlySales[month] += order.totalAmount;
    }

    return monthlySales;
}
function calculateOrdersByStatus(orders) {
    const statusCount = {};

    for (const order of orders) {
        if (!statusCount[order.status]) {
            statusCount[order.status] = 0;
        }

        statusCount[order.status]++;
    }

    return statusCount;
}
function calculateCancelledOrders(orders) {
    return orders.filter(
        order => order.status === "cancelled"
    ).length;
}
module.exports = {
    calculateTotalSales,
    calculateTotalOrders,
    calculateAverageOrderValue,
    getSalesSummary,
    calculatePendingOrders,
    calculateCompletedOrders,
    getTopSellingProduct,
    calculateSalesByDate,
    calculateProductSales,
    calculateMonthlySales,
    calculateOrdersByStatus,
    calculateCancelledOrders
};