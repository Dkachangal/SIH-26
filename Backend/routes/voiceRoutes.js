const express = require("express");
const router = express.Router();

const { getVoiceBusinessSummary } = require("../controllers/voiceController");

router.post("/summary", getVoiceBusinessSummary);

module.exports = router;