function createGEMListing(product) {
    if (!product) {
        throw new Error("Product information is required");
    }

    return {
        marketplace: "GeM",
        action: "CREATE",
        status: "PENDING",
        product
    };
}

function updateGEMListing(listingId, product) {
    if (!listingId) {
        throw new Error("GeM listing ID is required");
    }

    return {
        marketplace: "GeM",
        action: "UPDATE",
        status: "PENDING",
        listingId,
        product
    };
}

function removeGEMListing(listingId) {
    if (!listingId) {
        throw new Error("GeM listing ID is required");
    }

    return {
        marketplace: "GeM",
        action: "REMOVE",
        status: "PENDING",
        listingId
    };
}

module.exports = {
    createGEMListing,
    updateGEMListing,
    removeGEMListing
};