const { generateBusinessDashboard } = require("../services/businessDashboardService");

function getBusinessDashboard(req, res) {
    try {
        const { orders, inventoryItems } = req.body;

        const dashboard = generateBusinessDashboard(
            orders || [],
            inventoryItems || []
        );

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getBusinessDashboard
};