const {
    generateBusinessDashboard
} = require("./services/businessDashboardService");


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


const inventoryItems = [
    {
        productId: "product123",
        stockQuantity: 3,
        lowStockThreshold: 5,
        rawMaterialQuantity: 20,
        rawMaterialThreshold: 5
    },
    {
        productId: "product456",
        stockQuantity: 10,
        lowStockThreshold: 5,
        rawMaterialQuantity: 2,
        rawMaterialThreshold: 5
    }
];


const dashboard = generateBusinessDashboard(
    orders,
    inventoryItems
);


console.log("Business Dashboard:");
console.log(dashboard);