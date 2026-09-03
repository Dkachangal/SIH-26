const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrderById,
    updateOrderStatus,
    cancelExistingOrder
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/:orderId", getOrderById);
router.put("/:orderId/status", updateOrderStatus);
router.put("/:orderId/cancel", cancelExistingOrder);

module.exports = router;