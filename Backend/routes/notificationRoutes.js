const express = require("express");
const router = express.Router();

const {
    createNotification,
    getUserNotifications,
    markAsRead
} = require("../controllers/notificationController");

router.post("/", createNotification);

router.get("/user/:userId", getUserNotifications);

router.patch("/:notificationId/read", markAsRead);

module.exports = router;