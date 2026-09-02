const {
    getSalesSummary,
    calculatePendingOrders,
    calculateCompletedOrders,
    getTopSellingProduct
} = require("./services/salesAnalyticsService");


const orders = [
    {
        totalAmount: 1700,
        status: "delivered",
        items: [
            {
                product: "product123",
                quantity: 3,
                price: 1700
            }
        ]
    },
    {
        totalAmount: 1000,
        status: "delivered",
        items: [
            {
                product: "product456",
                quantity: 5,
                price: 200
            }
        ]
    },
    {
        totalAmount: 800,
        status: "pending",
        items: [
            {
                product: "product123",
                quantity: 2,
                price: 400
            }
        ]
    }
];


console.log("Sales Summary:");
console.log(getSalesSummary(orders));

console.log("Pending Orders:", calculatePendingOrders(orders));

console.log("Completed Orders:", calculateCompletedOrders(orders));

console.log("Top Selling Product:");
console.log(getTopSellingProduct(orders));