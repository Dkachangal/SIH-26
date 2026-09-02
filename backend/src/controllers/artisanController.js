const ArtisanProfile = require("../models/ArtisanProfile");

// CREATE PROFILE
const createProfile = async (req, res) => {
  try {
    const {
      businessName,
      craftType,
      description,
      village,
      city,
      state,
      experience,
      languages,
    } = req.body;

    if (!businessName || !craftType) {
      return res.status(400).json({
        message: "Business name and craft type are required",
      });
    }

    const existingProfile = await ArtisanProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Artisan profile already exists",
      });
    }

    const profile = await ArtisanProfile.create({
      user: req.user._id,
      businessName,
      craftType,
      description,
      village,
      city,
      state,
      experience,
      languages,
    });

    res.status(201).json({
      message: "Artisan profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const profile = await ArtisanProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone role");

    if (!profile) {
      return res.status(404).json({
        message: "Artisan profile not found",
      });
    }

    res.json({
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const profile = await ArtisanProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Artisan profile not found",
      });
    }

    const allowedFields = [
      "businessName",
      "craftType",
      "description",
      "village",
      "city",
      "state",
      "experience",
      "languages",
      "profileImage",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res.json({
      message: "Artisan profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};
