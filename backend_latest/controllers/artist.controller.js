const Product = require("../models/Product");
const User = require("../models/User");
const axios = require("axios");
const FormData = require("form-data");

// Helper function to send an image to Python API and get back the enhanced version
async function enhanceImageWithPython(base64DataUri) {
    try {
        // Extract base64 buffer from data URI
        const matches = base64DataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer;
        let contentType = 'image/jpeg';
        
        if (matches && matches.length === 3) {
            contentType = matches[1];
            buffer = Buffer.from(matches[2], 'base64');
        } else {
            // Fallback if raw base64 is passed without prefix
            buffer = Buffer.from(base64DataUri, 'base64');
        }

        // Prepare form data for Python FastAPI
        const formData = new FormData();
        formData.append('image', buffer, {
            filename: 'upload.jpg',
            contentType: contentType,
        });

        // const pythonUrl = process.env.PYTHON_ENHANCER_URL || "http://localhost:8000/enhance";
        let pythonUrl = process.env.PYTHON_ENHANCER_URL || "http://localhost:8000/enhance";
        
        // Ensure it ends with /enhance just in case
        if (!pythonUrl.endsWith('/enhance')) {
            pythonUrl = pythonUrl.endsWith('/') ? `${pythonUrl}enhance` : `${pythonUrl}/enhance`;
        }

        // Call Python AI enhancer service
        const response = await axios.post(pythonUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            responseType: 'arraybuffer', // Expect binary image bytes back
        });

        // Convert returned buffer back to a base64 Data URI to store in MongoDB
        const enhancedBuffer = Buffer.from(response.data);
        const enhancedBase64 = `data:image/jpeg;base64,${enhancedBuffer.toString('base64')}`;
        
        return enhancedBase64;
    } catch (error) {
        console.error("Python AI Enhancement Failed:", error.message);
        // Fallback: If AI fails, use original image so upload doesn't break
        return base64DataUri;
    }
}

// UPLOAD PRODUCT
async function uploadProduct(req, res) {
    try {
        const {
            name,
            category,
            craftType,
            description,
            descriptionRegional,
            descriptionEnglish,
            price,
            material,
            images,
            stock
        } = req.body;

        const artisan = req.user.id;

        if (!artisan || !name || price === undefined) {
            return res.status(400).json({
                message: "Artisan, name and price are required"
            });
        }

        const artisanUser = await User.findById(artisan);

        if (!artisanUser) {images
            return res.status(404).json({
                message: "Artisan not found"
            });
        }

        if (artisanUser.role !== "artisan") {
            return res.status(400).json({
                message: "User is not an artisan"
            });
        }

        // Loop through all images (handles 1 or multiple images) and enhance them via Python AI
        // Loop through all images and enhance them via Python AI with error isolation
        let processedImages = [];
        if (images && Array.isArray(images) && images.length > 0) {
            for (const imgObj of images) {
                const originalUrl = imgObj.originalUrl || imgObj;
                
                try {
                    // Call Python AI enhancer for this image
                    const enhancedUrl = await enhanceImageWithPython(originalUrl);
                    processedImages.push({
                        originalUrl: originalUrl,
                        enhancedUrl: enhancedUrl,
                        isEnhanced: true
                    });
                } catch (aiErr) {
                    console.log("Single image enhancement skipped, falling back to original:", aiErr.message);
                    processedImages.push({
                        originalUrl: originalUrl,
                        enhancedUrl: originalUrl, // Fallback so upload never dies
                        isEnhanced: false
                    });
                }
            }
        }

        // Create product document with original & enhanced images saved in MongoDB
        const product = await Product.create({
            artisan,
            name,
            category,
            craftType,
            description,
            descriptionRegional,
            descriptionEnglish,
            price,
            material,
            images: processedImages,
            stock
        });

        return res.status(201).json({
            message: "Product uploaded successfully with AI enhancement",
            product
        });

    } catch (error) {
        console.error("Upload Product Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


// VIEW ALL PRODUCTS
async function getAllProducts(req, res) {
    try {
        const products = await Product.find()
            .populate("artisan", "name email phone");

        return res.status(200).json({
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


// VIEW ARTISAN'S PRODUCTS
async function getMyProducts(req, res) {
    try {
        const { artisanId } = req.params;

        const products = await Product.find({
            artisan: artisanId
        }).populate("artisan", "name email phone");

        return res.status(200).json({
            message: "Artisan products fetched successfully",
            products
        });

    } catch (error) {
        console.error("Get Artisan Products Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    uploadProduct,
    getAllProducts,
    getMyProducts
};