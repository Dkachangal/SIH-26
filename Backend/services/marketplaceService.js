const {
    createONDCListing,
    updateONDCListing,
    removeONDCListing
} = require("./marketplace/ondc");

const {
    createGEMListing,
    updateGEMListing,
    removeGEMListing
} = require("./marketplace/gem");


async function createMarketplaceListing(marketplace, product) {
    if (marketplace === "ONDC") {
        return createONDCListing(product);
    }

    if (marketplace === "GeM") {
        return createGEMListing(product);
    }

    throw new Error("Unsupported marketplace");
}


async function updateMarketplaceListing(
    marketplace,
    listingId,
    product
) {
    if (marketplace === "ONDC") {
        return updateONDCListing(listingId, product);
    }

    if (marketplace === "GeM") {
        return updateGEMListing(listingId, product);
    }

    throw new Error("Unsupported marketplace");
}


async function removeMarketplaceListing(
    marketplace,
    listingId
) {
    if (marketplace === "ONDC") {
        return removeONDCListing(listingId);
    }

    if (marketplace === "GeM") {
        return removeGEMListing(listingId);
    }

    throw new Error("Unsupported marketplace");
}


module.exports = {
    createMarketplaceListing,
    updateMarketplaceListing,
    removeMarketplaceListing
};