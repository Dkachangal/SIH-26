const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./lib/db");

dotenv.config();

const app = express();


// ============================
// MIDDLEWARE
// ============================

app.use(express.json());


// ============================
// DATABASE
// ============================

connectDB();



// ROUTES


app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/artist", require("./routes/artist.routes"));

app.use("/api/business", require("./routes/business.routes"));


// HOME / HEALTH CHECK

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Backend API is running"
    });
});


// SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});