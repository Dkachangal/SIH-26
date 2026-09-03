const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const enhanceImage = async (filePath) => {

    const form = new FormData();

    form.append("image", fs.createReadStream(filePath));

    const response = await axios.post(
        process.env.IMAGE_AI_API,
        form,
        {
            headers: {
                ...form.getHeaders()
            }
        }
    );

    return response.data;
};

module.exports = {
    enhanceImage
};