const express = require("express");
const router = express.Router();

const {
    createListing,
    updateListing,
    removeListing
} = require("../controllers/marketplaceController");

router.post("/", createListing);

router.put("/:listingId", updateListing);

router.delete("/:listingId", removeListing);

module.exports = router;