const marketplaceService = require("../services/marketplaceService");

async function createListing(req, res) {
    try {
        const { marketplace, product } = req.body;

        const result = await marketplaceService.createMarketplaceListing(
            marketplace,
            product
        );

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateListing(req, res) {
    try {
        const { marketplace, product } = req.body;

        const result = await marketplaceService.updateMarketplaceListing(
            marketplace,
            req.params.listingId,
            product
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function removeListing(req, res) {
    try {
        const { marketplace } = req.body;

        const result = await marketplaceService.removeMarketplaceListing(
            marketplace,
            req.params.listingId
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createListing,
    updateListing,
    removeListing
};