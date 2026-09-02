require("dotenv").config();
const mongoose = require("mongoose");
require("./models/User");
require("./models/Product");
const {
    getBuyerById,
    getBuyerOrders,
    updateBuyerProfile
} = require("./services/buyerService");

const buyerId = "6a98727617353ebd5763869a";

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas");

        const buyer = await getBuyerById(buyerId);
        console.log("\nBuyer:");
        console.log(buyer);

        const orders = await getBuyerOrders(buyerId);
        console.log("\nOrders:");
        console.log(orders);

        const updatedBuyer = await updateBuyerProfile(buyerId, {
            name: "Test Buyer Updated",
            phone: "9999999999"
        });

        console.log("\nUpdated Buyer:");
        console.log(updatedBuyer);

        await mongoose.connection.close();
        console.log("\nBuyer test completed successfully");

    } catch (error) {
        console.error("Error:", error.message);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

test();