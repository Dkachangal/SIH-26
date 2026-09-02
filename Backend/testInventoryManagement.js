require("dotenv").config();
const mongoose = require("mongoose");

const {
    getInventory,
    increaseStock,
    setStock,
    decreaseStock,
    updateRawMaterial,
    adjustRawMaterial,
    getLowStockItems
} = require("./services/inventoryManagementService");

const productId = "6a98846814a22fabc354c9a6";

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas");

        console.log("\n1. Get Inventory:");
        console.log(await getInventory(productId));

        console.log("\n2. Increase Stock:");
        console.log(await increaseStock(productId, 5));

        console.log("\n3. Decrease Stock:");
        console.log(await decreaseStock(productId, 2));

        console.log("\n4. Set Stock:");
        console.log(await setStock(productId, 10));

        console.log("\n5. Update Raw Material:");
        console.log(await updateRawMaterial(productId, 25));

        console.log("\n6. Adjust Raw Material:");
        console.log(await adjustRawMaterial(productId, -5));

        console.log("\n7. Low Stock Items:");
        console.log(await getLowStockItems());

        await mongoose.connection.close();

        console.log("\nInventory test completed successfully");

    } catch (error) {
        console.error("Error:", error.message);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

test();