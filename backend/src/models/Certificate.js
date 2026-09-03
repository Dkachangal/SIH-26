const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        artisan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        certificateNumber: {
            type: String,
            required: true,
            unique: true
        },

        craftType: {
            type: String,
            required: true
        },

        issuedDate: {
            type: Date,
            default: Date.now
        },

        description: {
            type: String
        },

        status: {
            type: String,
            enum: ["active", "expired", "revoked"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Certificate", certificateSchema);