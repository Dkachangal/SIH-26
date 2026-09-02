const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
    },

    craftType: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    descriptionHindi: {
      type: String,
      default: "",
    },

    descriptionEnglish: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    material: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 1,
      min: 0,
    },

    aiEnhanced: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);