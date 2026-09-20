const Product = require("../models/Product");


// DISPLAY ALL PRODUCTS
async function displayAllProducts(req, res) {
    try {

        const products = await Product.find()
            .populate("artisan", "name email phone");

        return res.status(200).json({
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        console.error("Business Products Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    displayAllProducts
};