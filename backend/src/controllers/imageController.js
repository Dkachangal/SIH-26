const path = require("path");

const { enhanceImage } = require("../services/imageService");

const uploadAndEnhanceImages = async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image"
            });
        }

        const results = [];

        for (const file of req.files) {

            // Original image URL
            const originalImageUrl =
                `${req.protocol}://${req.get("host")}/uploads/original/${file.filename}`;

            // Send image to AI teammate API
            const aiResponse = await enhanceImage(file.path);

            /*
             AI teammate should return something like:

             {
                 "enhancedImageUrl": "https://..."
             }

             OR whatever final format they decide.
            */

            const enhancedImageUrl =
                aiResponse.enhancedImageUrl;

            results.push({
                originalImageUrl,
                enhancedImageUrl
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product uploaded and enhanced successfully",
            images: results
        });

    } catch (error) {

        console.error(
            "Image enhancement error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Image enhancement failed",
            error: error.message
        });
    }
};

module.exports = {
    uploadAndEnhanceImages
};