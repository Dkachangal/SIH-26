require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const artisanRoutes = require("./src/routes/artisanRoutes");
const productRoutes = require("./src/routes/productRoutes");
const imageRoutes = require("./src/routes/imageRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/product", imageRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/products", productRoutes);
app.use("/api/certificates", certificateRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "SIH26090 Backend Running",
  });
});
const path = require("path");

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
