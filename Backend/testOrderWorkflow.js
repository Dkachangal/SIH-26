const {
    prepareOrderWorkflow
} = require("./services/orderWorkflowService");


const inventoryItems = [
    {
        productId: "product123",
        stockQuantity: 10,
        lowStockThreshold: 5,
        rawMaterialQuantity: 20,
        rawMaterialThreshold: 5
    }
];


const orderItems = [
    {
        product: "product123",
        quantity: 6
    }
];


const result = prepareOrderWorkflow(
    orderItems,
    inventoryItems
);


console.log(result);

console.log("\nInsufficient Stock Test:");

const inventoryItems2 = [
    {
        productId: "product123",
        stockQuantity: 10,
        lowStockThreshold: 5,
        rawMaterialQuantity: 20,
        rawMaterialThreshold: 5
    },
    {
        productId: "product456",
        stockQuantity: 2,
        lowStockThreshold: 5,
        rawMaterialQuantity: 10,
        rawMaterialThreshold: 5
    }
];

const orderItems2 = [
    {
        product: "product123",
        quantity: 3
    },
    {
        product: "product456",
        quantity: 5
    }
];

try {
    const result = prepareOrderWorkflow(
        orderItems2,
        inventoryItems2
    );

    console.log(result);
} catch (error) {
    console.log("Error:", error.message);
}