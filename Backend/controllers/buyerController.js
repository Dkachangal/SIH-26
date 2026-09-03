const buyerService = require("../services/buyerService");

async function getBuyer(req, res) {
    try {
        const buyer = await buyerService.getBuyerById(req.params.buyerId);
        res.status(200).json(buyer);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function getBuyerOrders(req, res) {
    try {
        const orders = await buyerService.getBuyerOrders(req.params.buyerId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function updateBuyerProfile(req, res) {
    try {
        const buyer = await buyerService.updateBuyerProfile(
            req.params.buyerId,
            req.body
        );

        res.status(200).json(buyer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getBuyer,
    getBuyerOrders,
    updateBuyerProfile
};