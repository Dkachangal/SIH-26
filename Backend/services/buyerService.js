const User = require("../models/User");
const Order = require("../models/Order");

async function getBuyerById(buyerId) {
    const buyer = await User.findOne({
        _id: buyerId,
        role: "buyer"
    }).select("-password");

    if (!buyer) {
        throw new Error("Buyer not found");
    }

    return buyer;
}

async function getBuyerOrders(buyerId) {
    const buyer = await User.findOne({
        _id: buyerId,
        role: "buyer"
    });

    if (!buyer) {
        throw new Error("Buyer not found");
    }

    const orders = await Order.find({
        buyer: buyerId
    })
        .populate("items.product")
        .sort({ createdAt: -1 });

    return orders;
}

async function updateBuyerProfile(buyerId, updatedData) {

    if (!updatedData) {
        throw new Error("Update data is required");
    }

    const allowedFields = ["name", "phone"];
    const updates = {};

    for (const field of allowedFields) {
        if (updatedData[field] !== undefined) {
            updates[field] = updatedData[field];
        }
    }

    const buyer = await User.findOneAndUpdate(
        {
            _id: buyerId,
            role: "buyer"
        },
        updates,
        {
            returnDocument: "after",
            runValidators: true
        }
    ).select("-password");

    if (!buyer) {
        throw new Error("Buyer not found");
    }

    return buyer;
}

module.exports = {
    getBuyerById,
    getBuyerOrders,
    updateBuyerProfile
};