const {
    generateVoiceBusinessSummary
} = require("./services/businessVoiceService");

const orders = [
    {
        totalAmount: 1700,
        status: "delivered",
        items: [
            {
                product: "Handmade Pottery",
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
                product: "Handmade Basket",
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
                product: "Handmade Pottery",
                quantity: 2,
                price: 400
            }
        ]
    }
];

const result = generateVoiceBusinessSummary(orders);

console.log("Voice Business Summary:");
console.log(result.message);

console.log("\nDashboard:");
console.log(result.dashboard);