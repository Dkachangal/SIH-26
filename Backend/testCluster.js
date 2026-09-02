require("dotenv").config();
const mongoose = require("mongoose");
require("./models/User");
const {
    createCluster,
    addMember,
    removeMember,
    getClusterMembers,
    enableStorefront,
    disableStorefront,
    getStorefront
} = require("./services/clusterService");

const ownerId = "6a98727617353ebd5763869a";
const memberId = "6a9823977dce2eacd058d3d2";

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Atlas");

        // 1. Create cluster
        const cluster = await createCluster(
            "Test Artisan Cluster",
            "Test collective",
            "Noida",
            ownerId
        );
        console.log("\n1. Cluster Created:");
        console.log(cluster);

        // 2. Add member
        await addMember(cluster._id, memberId, ownerId);
        console.log("\n2. Member Added");

        // 3. Get members
        const members = await getClusterMembers(cluster._id);
        console.log("\n3. Cluster Members:");
        console.log(members);

        // 4. Enable storefront
        await enableStorefront(
            cluster._id,
            "Test Collective Store",
            "Handmade products",
            ownerId
        );
        console.log("\n4. Storefront Enabled");

        // 5. Get storefront
        const storefront = await getStorefront(cluster._id);
        console.log("\n5. Storefront:");
        console.log(storefront);

        // 6. Disable storefront
        await disableStorefront(cluster._id, ownerId);
        console.log("\n6. Storefront Disabled");

        await mongoose.connection.close();

        console.log("\nCluster test completed successfully");

    } catch (error) {
        console.error("Error:", error.message);

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

test();