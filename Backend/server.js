require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./models/Product");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const buyerRoutes = require("./routes/buyerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const clusterRoutes = require("./routes/clusterRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");

// API routes
app.use("/api/buyers", buyerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/clusters", clusterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/marketplace", marketplaceRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Business Backend API is running" });
});

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });