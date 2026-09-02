require("dotenv").config();
const mongoose = require("mongoose");

const { cancelOrder } = require("./services/orderCancellationService");

const orderId = "6a98876a52fad0c9ddf61150";

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas");

        const cancelledOrder = await cancelOrder(orderId);

        console.log("\nOrder Cancelled:");
        console.log("Order ID:", cancelledOrder._id);
        console.log("Status:", cancelledOrder.status);

        await mongoose.connection.close();

        console.log("\nCancellation test completed successfully");
    } catch (error) {
        console.error("Error:", error.message);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

test();