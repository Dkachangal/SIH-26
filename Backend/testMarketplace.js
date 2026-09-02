const {
    createMarketplaceListing,
    updateMarketplaceListing,
    removeMarketplaceListing
} = require("./services/marketplaceService");


const product = {
    name: "Handmade Pottery",
    price: 1700,
    quantity: 10
};


async function test() {

    console.log("ONDC Listing:");

    console.log(
        await createMarketplaceListing(
            "ONDC",
            product
        )
    );


    console.log("GeM Listing:");

    console.log(
        await createMarketplaceListing(
            "GeM",
            product
        )
    );


    console.log("Update Listing:");

    console.log(
        await updateMarketplaceListing(
            "ONDC",
            "ONDC123",
            product
        )
    );


    console.log("Remove Listing:");

    console.log(
        await removeMarketplaceListing(
            "GeM",
            "GEM123"
        )
    );
}


test();