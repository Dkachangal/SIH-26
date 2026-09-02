const express = require("express");

const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/artisanController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", protect, createProfile);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

module.exports = router;
