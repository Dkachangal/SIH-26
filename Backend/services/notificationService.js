const Notification = require("../models/Notification");

async function createNotification(userId, type, message) {
    const notification = await Notification.create({
        user: userId,
        type,
        message
    });

    return notification;
}

async function getUserNotifications(userId) {
    return await Notification.find({
        user: userId
    }).sort({ createdAt: -1 });
}

async function markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { returnDocument: "after" }
    );
}

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead
};