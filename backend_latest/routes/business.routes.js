const express = require("express");

const router = express.Router();

const businessController = require("../controllers/business.controller");

router.get(
    "/products",
    businessController.displayAllProducts
);

module.exports = router;