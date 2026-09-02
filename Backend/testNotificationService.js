require("dotenv").config();
const mongoose = require("mongoose");

const {
    createNotification,
    getUserNotifications,
    markAsRead
} = require("./services/notificationService");

const buyerId = "6a98727617353ebd5763869a";

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas");

        console.log("\n1. Create Notification:");
        const notification = await createNotification(
            buyerId,
            "ORDER_UPDATE",
            "Your test order has been updated."
        );
        console.log(notification);

        console.log("\n2. Get Notifications:");
        const notifications = await getUserNotifications(buyerId);
        console.log(notifications);

        console.log("\n3. Mark As Read:");
        const updated = await markAsRead(notification._id);
        console.log(updated);

        await mongoose.connection.close();

        console.log("\nNotification test completed successfully");

    } catch (error) {
        console.error("Error:", error.message);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

test();