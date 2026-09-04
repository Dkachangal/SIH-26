const path = require("path");
const mongoose = require("mongoose");
const Product = require("../models/Product"); // Ensure this path matches your directory structure
const User = require("../models/User"); // Required to find the artisan's ObjectId

const { enhanceImage } = require("../services/imageService");

const uploadAndEnhanceImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image"
            });
        }
        
        // Extract frontend data
        const { name, description, price, email } = req.body;
        const results = [];
        const enhancedUrls = [];

        // 1. Process images via AI Service
        for (const file of req.files) {
            const originalImageUrl = `${req.protocol}://${req.get("host")}/uploads/original/${file.filename}`;
            const aiResponse = await enhanceImage(file.path);
            const enhancedImageUrl = aiResponse.enhancedImageUrl;

            results.push({ originalImageUrl, enhancedImageUrl });
            enhancedUrls.push(enhancedImageUrl);
        }

        // 2. Find Artisan (User) ID to satisfy the Product schema ref
        const user = await User.findOne({ email });
        // Fallback ObjectId if the user doesn't exist yet, preventing a database crash
        const artisanId = user ? user._id : new mongoose.Types.ObjectId(); 



// AYUSH - DESCRIPTION API .

        // 3. Save Product to Database
        const newProduct = new Product({
            artisan: artisanId,
            name: name,
            description: description,
            price: Number(price),
            images: enhancedUrls,
            aiEnhanced: true
        });

        await newProduct.save();

        // 4. Return matching format for AddProduct.jsx
        return res.status(200).json({
            success: true,
            message: "Product uploaded, enhanced, and saved successfully",
            product: newProduct,
            enhancedImageUrls: enhancedUrls 
        });

    } catch (error) {
        console.error("Upload/DB Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to process and save product",
            error: error.message
        });
    }
};

module.exports = {
    uploadAndEnhanceImages
};