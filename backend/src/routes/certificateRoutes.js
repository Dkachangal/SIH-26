const express = require("express");

const {
    createCertificate,
    getCertificates,
    getCertificateById
} = require("../controllers/certificateController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCertificate);

router.get("/", authMiddleware, getCertificates);

router.get("/:id", authMiddleware, getCertificateById);

module.exports = router;