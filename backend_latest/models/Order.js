const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Customer who placed the order
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Products purchased in this order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        artisan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        // Price at the time of purchase
        price: {
          type: Number,
          required: true,
          min: 0,
        },

        // Product name at the time of purchase
        name: {
          type: String,
          required: true,
        },

        // Product image at the time of purchase
        image: {
          type: String,
          default: "",
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);