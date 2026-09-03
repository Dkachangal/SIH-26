const { generateVoiceBusinessSummary } = require("../services/businessVoiceService");

function getVoiceBusinessSummary(req, res) {
    try {
        const { orders } = req.body;

        const result = generateVoiceBusinessSummary(orders || []);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getVoiceBusinessSummary
};