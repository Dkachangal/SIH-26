const express = require("express");

const router = express.Router();

const artistController = require("../controllers/artist.controller");
const protect = require("../middleware/auth.middleware");


// UPLOAD PRODUCT
router.post("/products",protect,artistController.uploadProduct);


// VIEW ALL PRODUCTS
router.get("/products", artistController.getAllProducts);


// VIEW PRODUCTS OF PARTICULAR ARTISAN
router.get("/products/:artisanId",artistController.getMyProducts);

module.exports = router;