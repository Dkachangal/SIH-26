const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            required: true,
            enum: [
                "LOW_STOCK",
                "RAW_MATERIAL_LOW",
                "NEW_ORDER",
                "ORDER_UPDATE"
            ]
        },

        message: {
            type: String,
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);