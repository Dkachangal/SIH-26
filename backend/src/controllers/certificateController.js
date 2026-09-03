const Certificate = require("../models/Certificate");

const createCertificate = async (req, res) => {
    try {
        const { craftType, description } = req.body;

        const certificateNumber =
            "SIH-" + Date.now();

        const certificate = await Certificate.create({
            artisan: req.user.id,
            certificateNumber,
            craftType,
            description
        });

        res.status(201).json({
            success: true,
            message: "Certificate created successfully",
            certificate
        });

    } catch (error) {
        console.error("Certificate creation error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create certificate",
            error: error.message
        });
    }
};

const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({
            artisan: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            certificates
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificates",
            error: error.message
        });
    }
};

const getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            _id: req.params.id,
            artisan: req.user.id
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        res.status(200).json({
            success: true,
            certificate
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificate",
            error: error.message
        });
    }
};

module.exports = {
    createCertificate,
    getCertificates,
    getCertificateById
};