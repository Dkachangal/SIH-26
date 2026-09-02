const regionalWages = {
    "Uttar Pradesh": 50,
    "Delhi": 70,
    "Rajasthan": 55,
    "Madhya Pradesh": 50,
    "Bihar": 45,
    "West Bengal": 50
};

function getRegionalWage(region) {
    const wage = regionalWages[region];

    if (!wage) {
        throw new Error(`Wage rate not available for ${region}`);
    }

    return wage;
}

module.exports = {
    getRegionalWage
};