const express = require("express");
const router = express.Router();

const { getBusinessDashboard } = require("../controllers/dashboardController");

router.post("/", getBusinessDashboard);

module.exports = router;