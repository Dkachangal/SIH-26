const Product = require("../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    // Don't search for empty/very short queries
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const query = q.trim();

    const products = await Product.aggregate([
      {
        $search: {
          index: "productSearch",
          compound: {
            should: [
              // Product name - highest priority
              {
                autocomplete: {
                  query,
                  path: "name",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                  score: {
                    boost: {
                      value: 5,
                    },
                  },
                },
              },

              // Category
              {
                autocomplete: {
                  query,
                  path: "category",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                  score: {
                    boost: {
                      value: 3,
                    },
                  },
                },
              },

              // Craft type
              {
                autocomplete: {
                  query,
                  path: "craftType",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                  score: {
                    boost: {
                      value: 2,
                    },
                  },
                },
              },

              // Material
              {
                autocomplete: {
                  query,
                  path: "material",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                  score: {
                    boost: {
                      value: 2,
                    },
                  },
                },
              },

              // Description
              {
                autocomplete: {
                  query,
                  path: "description",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                },
              },

              // Hindi description
              {
                autocomplete: {
                  query,
                  path: "descriptionHindi",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                },
              },

              // English description
              {
                autocomplete: {
                  query,
                  path: "descriptionEnglish",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                    maxExpansions: 50,
                  },
                },
              },
            ],

            minimumShouldMatch: 1,
          },
        },
      },

      // Maximum 20 search results
      {
        $limit: 20,
      },

      // Return only fields needed by frontend
      {
        $project: {
          _id: 1,
          artisan: 1,
          name: 1,
          category: 1,
          craftType: 1,
          description: 1,
          descriptionHindi: 1,
          descriptionEnglish: 1,
          price: 1,
          material: 1,
          images: 1,
          stock: 1,
          aiEnhanced: 1,

          score: {
            $meta: "searchScore",
          },
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};

module.exports = {
  searchProducts,
};