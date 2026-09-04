const express = require("express");

const {
  searchProducts,
} = require("../controllers/searchController");

const router = express.Router();

router.get("/", searchProducts);

module.exports = router;


// add this to server.js
// const searchRoutes = require("./src/routes/searchRoutes");

// app.use("/api/search", searchRoutes);