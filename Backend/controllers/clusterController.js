const clusterService = require("../services/clusterService");

async function createCluster(req, res) {
    try {
        const { name, description, location, userId } = req.body;

        const cluster = await clusterService.createCluster(
            name,
            description,
            location,
            userId
        );

        res.status(201).json(cluster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function addMember(req, res) {
    try {
        const { userId, requesterId } = req.body;

        const cluster = await clusterService.addMember(
            req.params.clusterId,
            userId,
            requesterId
        );

        res.status(200).json(cluster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function removeMember(req, res) {
    try {
        const { userId, requesterId } = req.body;

        const cluster = await clusterService.removeMember(
            req.params.clusterId,
            userId,
            requesterId
        );

        res.status(200).json(cluster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getClusterMembers(req, res) {
    try {
        const members = await clusterService.getClusterMembers(
            req.params.clusterId
        );

        res.status(200).json(members);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function enableStorefront(req, res) {
    try {
        const { displayName, description, requesterId } = req.body;

        const cluster = await clusterService.enableStorefront(
            req.params.clusterId,
            displayName,
            description,
            requesterId
        );

        res.status(200).json(cluster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function disableStorefront(req, res) {
    try {
        const { requesterId } = req.body;

        const cluster = await clusterService.disableStorefront(
            req.params.clusterId,
            requesterId
        );

        res.status(200).json(cluster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getStorefront(req, res) {
    try {
        const storefront = await clusterService.getStorefront(
            req.params.clusterId
        );

        res.status(200).json(storefront);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function getStorefrontProducts(req, res) {
    try {
        const Product = require("../models/Product");

        const products = await clusterService.getClusterStorefrontProducts(
            req.params.clusterId,
            Product
        );

        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    createCluster,
    addMember,
    removeMember,
    getClusterMembers,
    enableStorefront,
    disableStorefront,
    getStorefront,
    getStorefrontProducts
};