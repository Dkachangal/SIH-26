function createONDCListing(product) {
    if (!product) {
        throw new Error("Product information is required");
    }

    return {
        marketplace: "ONDC",
        action: "CREATE",
        status: "PENDING",
        product
    };
}

function updateONDCListing(listingId, product) {
    if (!listingId) {
        throw new Error("ONDC listing ID is required");
    }

    return {
        marketplace: "ONDC",
        action: "UPDATE",
        status: "PENDING",
        listingId,
        product
    };
}

function removeONDCListing(listingId) {
    if (!listingId) {
        throw new Error("ONDC listing ID is required");
    }

    return {
        marketplace: "ONDC",
        action: "REMOVE",
        status: "PENDING",
        listingId
    };
}

module.exports = {
    createONDCListing,
    updateONDCListing,
    removeONDCListing
};