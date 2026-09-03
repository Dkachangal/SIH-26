const axios = require("axios");

const generateCatalog = async (data) => {
  const response = await axios.post(
    process.env.CATALOG_AI_API,
    data
  );

  return response.data;
};

module.exports = {
  generateCatalog,
};