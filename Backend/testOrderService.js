require("dotenv").config();
const mongoose = require("mongoose");

const { createOrder } = require("./services/orderService");

const buyerId = "6a98727617353ebd5763869a";
const productId = "6a98846814a22fabc354c9a6";

const inventoryItems = [
    {
        productId: productId,
        stockQuantity: 10,
        lowStockThreshold: 5,
        rawMaterialQuantity: 20,
        rawMaterialThreshold: 5
    }
];

const orderItems = [
    {
        product: productId,
        quantity: 2,
        price: 1200
    }
];

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas");

        const result = await createOrder(
            buyerId,
            orderItems,
            {
                address: "Test Address",
                city: "Noida",
                state: "Uttar Pradesh",
                pincode: "201301"
            },
            inventoryItems
        );

        console.log("\nOrder Created:");
        console.log(result.order);

        console.log("\nStock Updates:");
        console.log(result.stockUpdates);

        await mongoose.connection.close();

        console.log("\nTest completed successfully");
    } catch (error) {
        console.error("Error:", error.message);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

test();