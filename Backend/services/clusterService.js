const Cluster = require("../models/Cluster");
async function isClusterOwner(clusterId, userId) {
    const cluster = await Cluster.findById(clusterId);

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    return cluster.createdBy.toString() === userId.toString();
}
async function createCluster(name, description, location, userId) {
    if (!name || !name.trim()) {
        throw new Error("Cluster name is required");
    }

    if (!userId) {
        throw new Error("User ID is required");
    }

    const cluster = await Cluster.create({
        name: name.trim(),
        description,
        location,
        members: [userId],
        createdBy: userId
    });

    return cluster;
}
async function addMember(clusterId, userId, requesterId) {
    if (!userId) {
    throw new Error("User ID is required");
}

if (!requesterId) {
    throw new Error("Requester ID is required");
}
    const cluster = await Cluster.findById(clusterId);

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    if (cluster.createdBy.toString() !== requesterId.toString()) {
        throw new Error("Only cluster owner can add members");
    }

    const alreadyMember = cluster.members.some(
        member => member.toString() === userId.toString()
    );

    if (alreadyMember) {
        throw new Error("User is already a member of this cluster");
    }

    cluster.members.push(userId);

    await cluster.save();

    return cluster;
}
async function removeMember(clusterId, userId, requesterId) {
    const cluster = await Cluster.findById(clusterId);

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    if (cluster.createdBy.toString() !== requesterId.toString()) {
        throw new Error("Only cluster owner can remove members");
    }
    if (cluster.createdBy.toString() === userId.toString()) {
    throw new Error("Cluster owner cannot be removed");
}
    cluster.members = cluster.members.filter(
        member => member.toString() !== userId.toString()
    );

    await cluster.save();

    return cluster;
}

async function getClusterMembers(clusterId) {
    const cluster = await Cluster.findById(clusterId)
        .populate("members", "name email");

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    return cluster.members;
}
async function enableStorefront(clusterId, displayName, description, requesterId) {
    const cluster = await Cluster.findById(clusterId);

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    if (cluster.createdBy.toString() !== requesterId.toString()) {
        throw new Error("Only cluster owner can enable storefront");
    }

    cluster.storefront.isEnabled = true;
    cluster.storefront.displayName = displayName;
    cluster.storefront.description = description;

    await cluster.save();

    return cluster;
}

async function disableStorefront(clusterId, requesterId) {
    const cluster = await Cluster.findById(clusterId);

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    if (cluster.createdBy.toString() !== requesterId.toString()) {
        throw new Error("Only cluster owner can disable storefront");
    }

    cluster.storefront.isEnabled = false;

    await cluster.save();

    return cluster;
}

async function getStorefront(clusterId) {
    const cluster = await Cluster.findById(clusterId)
        .populate("members", "name");

    if (!cluster) {
        throw new Error("Cluster not found");
    }

    if (!cluster.storefront.isEnabled) {
        throw new Error("Storefront is not enabled");
    }

    return {
        clusterName: cluster.storefront.displayName,
        description: cluster.storefront.description,
        location: cluster.location,
        members: cluster.members
    };
}
async function getClusterStorefrontProducts(clusterId, Product) { 
    const cluster = await Cluster.findById(clusterId); 
    if (!cluster) { throw new Error("Cluster not found"); } 
    if (!cluster.storefront.isEnabled) { 
        throw new Error("Storefront is not enabled"); } 
        if (!Product) { throw new Error("Product model is required"); } 
        const products = await Product.find({
             artisan: { $in: cluster.members } });
              return products; }
module.exports = {
    isClusterOwner,
    createCluster,
    addMember,
    removeMember,
    getClusterMembers,
    enableStorefront,
    disableStorefront,
    getStorefront,
    getClusterStorefrontProducts
};