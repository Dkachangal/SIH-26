const Product = require("../models/Product");
const User = require("../models/User");


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

        if (!artisanUser) {
            return res.status(404).json({
                message: "Artisan not found"
            });
        }

        if (artisanUser.role !== "artisan") {
            return res.status(400).json({
                message: "User is not an artisan"
            });
        }

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
            images,
            stock
        });

        return res.status(201).json({
            message: "Product uploaded successfully",
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