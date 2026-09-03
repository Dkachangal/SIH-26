const Product = require("../models/Product");
const { generateCatalog } = require("../services/aiCatalogService");

const generateProductCatalog = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      text,
      language,
      productName,
      craftType,
      material
    } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text or voice-transcribed text is required"
      });
    }

    const aiResponse = await generateCatalog({
      text,
      language,
      productName,
      craftType,
      material
    });

    const product = await Product.findOne({
      _id: productId,
      artisan: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.descriptionHindi =
      aiResponse.descriptionHindi || "";

    product.descriptionEnglish =
      aiResponse.descriptionEnglish || "";

    product.description =
      aiResponse.descriptionEnglish ||
      aiResponse.descriptionHindi ||
      text;

    await product.save();

    res.json({
      success: true,
      message: "Multilingual catalog generated successfully",
      catalog: {
        descriptionHindi: product.descriptionHindi,
        descriptionEnglish: product.descriptionEnglish,
        description: product.description
      }
    });

  } catch (error) {
    console.error("AI Catalog Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI catalog generation failed",
      error: error.message
    });
  }
};

module.exports = {
  generateProductCatalog
};