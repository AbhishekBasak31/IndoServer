import { HeroSection } from "../../../Model/Homepage/Hero/Hero.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create Hero Section
// @route   POST /api/v1/home/hero
// @access  Private/Admin
// ==========================================
export const createHero = async (req, res) => {
  try {
    const { Htext, Dtext } = req.body;

    // 1. Check if Hero Section already exists (Singleton)
    const existingHero = await HeroSection.findOne();
    if (existingHero) {
      return res.status(400).json({
        success: false,
        error: "Hero Section already exists. Please update the existing one.",
      });
    }

    // 2. Validate Text Fields
    if (!Htext || !Dtext ) {
      return res.status(400).json({ success: false, error: "All text fields are required." });
    }

    // 3. Handle Video Uploads
    // req.files is an object because we use upload.fields()
    const video1File = req.files?.["Video1"]?.[0];
    const video2File = req.files?.["Video2"]?.[0];
    const video3File = req.files?.["Video3"]?.[0];

    if (!video1File || !video2File || !video3File) {
      return res.status(400).json({ success: false, error: "All 3 videos are required." });
    }

    // Upload to Cloudinary (or return local path if you prefer)
    const video1Url = await uploadOnCloudinary(video1File.path);
    const video2Url = await uploadOnCloudinary(video2File.path);
    const video3Url = await uploadOnCloudinary(video3File.path);

    if (!video1Url || !video2Url || !video3Url) {
      return res.status(500).json({ success: false, error: "Error uploading videos." });
    }

    // 4. Save to DB
    const newHero = new HeroSection({
      Htext,
      Dtext,
      Video1: video1Url.secure_url,
      Video2: video2Url.secure_url,
      Video3: video3Url.secure_url,
    });

    await newHero.save();

    res.status(201).json({
      success: true,
      message: "Hero Section created successfully",
      data: newHero,
    });
  } catch (error) {
    console.error("❌ Error creating Hero Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Hero Section
// @route   GET /api/v1/home/hero
// @access  Public
// ==========================================
export const getHero = async (req, res) => {
  try {
    // Assuming there is only one hero section
    const hero = await HeroSection.findOne();
    
    if (!hero) {
      return res.status(404).json({ success: false, message: "No Hero Section found." });
    }

    res.status(200).json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error("❌ Error fetching Hero Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Hero Section
// @route   PATCH /api/v1/home/hero/:id
// @access  Private/Admin
// ==========================================
export const updateHero = async (req, res) => {
  try {
    // 1. Find the single document
    const hero = await HeroSection.findOne();
    
    if (!hero) {
      return res.status(404).json({ success: false, error: "Hero Section not created yet." });
    }

    const { Htext, Dtext } = req.body;

    // 2. Update Text Fields if provided
    if (Htext) hero.Htext = Htext;
    if (Dtext) hero.Dtext = Dtext;

    // 3. Update Videos individually if provided
    if (req.files?.["Video1"]?.[0]) {
      const upload = await uploadOnCloudinary(req.files["Video1"][0].path);
      if (upload) hero.Video1 = upload.secure_url;
    }

    if (req.files?.["Video2"]?.[0]) {
      const upload = await uploadOnCloudinary(req.files["Video2"][0].path);
      if (upload) hero.Video2 = upload.secure_url;
    }

    if (req.files?.["Video3"]?.[0]) {
      const upload = await uploadOnCloudinary(req.files["Video3"][0].path);
      if (upload) hero.Video3 = upload.secure_url;
    }

    await hero.save();

    res.status(200).json({
      success: true,
      message: "Hero Section updated successfully",
      data: hero,
    });
  } catch (error) {
    console.error("❌ Error updating Hero Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Hero Section (Singleton)
// @route   DELETE /api/v1/home/hero
// @access  Private/Admin
// ==========================================
export const deleteHero = async (req, res) => {
  try {
    // Find and delete the first (and only) document
    const deletedHero = await HeroSection.findOneAndDelete();

    if (!deletedHero) {
      return res.status(404).json({
        success: false,
        error: "Hero Section not found to delete.",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Hero Section deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting Hero Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};