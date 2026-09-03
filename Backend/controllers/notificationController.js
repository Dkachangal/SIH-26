const notificationService = require("../services/notificationService");

async function createNotification(req, res) {
    try {
        const { userId, type, message } = req.body;

        const notification = await notificationService.createNotification(
            userId,
            type,
            message
        );

        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getUserNotifications(req, res) {
    try {
        const notifications = await notificationService.getUserNotifications(
            req.params.userId
        );

        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function markAsRead(req, res) {
    try {
        const notification = await notificationService.markAsRead(
            req.params.notificationId
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead
};