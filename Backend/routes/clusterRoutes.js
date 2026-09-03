const express = require("express");
const router = express.Router();

const {
    createCluster,
    addMember,
    removeMember,
    getClusterMembers,
    enableStorefront,
    disableStorefront,
    getStorefront,
    getStorefrontProducts
} = require("../controllers/clusterController");

router.post("/", createCluster);

router.get("/:clusterId/members", getClusterMembers);

router.post("/:clusterId/members", addMember);

router.delete("/:clusterId/members", removeMember);

router.post("/:clusterId/storefront/enable", enableStorefront);

router.post("/:clusterId/storefront/disable", disableStorefront);

router.get("/:clusterId/storefront", getStorefront);

router.get("/:clusterId/storefront/products", getStorefrontProducts);

module.exports = router;