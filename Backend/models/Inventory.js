const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        stockQuantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        lowStockThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 5
        },

        rawMaterialQuantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        rawMaterialThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 5
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Inventory", inventorySchema);