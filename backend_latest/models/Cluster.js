const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        storefront: {
            isEnabled: {
                type: Boolean,
                default: false
            },

            displayName: {
                type: String,
                trim: true
            },

            description: {
                type: String,
                trim: true
            }
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cluster", clusterSchema);