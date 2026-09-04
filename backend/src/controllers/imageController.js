const path = require("path");
const mongoose = require("mongoose");
const Product = require("../models/Product"); // Ensure this path matches your directory structure
const User = require("../models/User"); // Required to find the artisan's ObjectId

const { enhanceImage } = require("../services/imageService");

const uploadAndEnhanceImages = async (req, res) => {
    console.log("Received request to upload and enhance images");
    try {

        // Extract frontend data
        const { name, description, price, email } = req.body;
        const results = [];
        const enhancedUrls = [];


// AYUSH - DESCRIPTION API .

        // 3. Save Product to Database
        const newProduct = new Product({
            artisan: name,
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