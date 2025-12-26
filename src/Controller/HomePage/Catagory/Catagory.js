import { Catagory } from "../../../Model/Homepage/Catagory/Catagory.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create Catagory Section (Singleton)
// @route   POST /api/v1/home/catagory
// @access  Private/Admin
// ==========================================
export const createCatagory = async (req, res) => {
  try {
    // 1. Check if section already exists (Singleton)
    const existing = await Catagory.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Catagory section already exists. Please use update instead.",
      });
    }

    const { Htext } = req.body;

    // 2. Validate Text Field
    if (!Htext) {
      return res.status(400).json({ success: false, error: "Header text (Htext) is required." });
    }

    // 3. Handle Background Image Upload
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Background Image (BgImg) is required." });
    }

    const uploadedImg = await uploadOnCloudinary(req.file.path);
    if (!uploadedImg) {
      return res.status(500).json({ success: false, error: "Error uploading background image." });
    }

    // 4. Save to DB (Types array is initialized empty by default schema behavior or explicitly empty)
    const newCatagory = new Catagory({
      Htext,
      BgImg: uploadedImg.secure_url,
      Types: [], // Initially empty as requested
    });

    await newCatagory.save();

    res.status(201).json({
      success: true,
      message: "Catagory section created successfully",
      data: newCatagory,
    });
  } catch (error) {
    console.error("❌ Error creating Catagory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Catagory Section (with populated Types)
// @route   GET /api/v1/home/catagory
// @access  Public
// ==========================================
export const getCatagory = async (req, res) => {
  try {
    const section = await Catagory.findOne().populate("Types"); // Populate the linked VehicleTypes
    
    if (!section) {
      return res.status(404).json({ success: false, message: "Catagory section not found." });
    }

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("❌ Error fetching Catagory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Catagory Section (Singleton)
// @route   PATCH /api/v1/home/catagory
// @access  Private/Admin
// ==========================================
export const updateCatagory = async (req, res) => {
  try {
    const section = await Catagory.findOne();
    if (!section) {
      return res.status(404).json({ success: false, error: "Catagory section not found." });
    }

    const { Htext } = req.body;

    // Update Text Field
    if (Htext) section.Htext = Htext;

    // Update Background Image if a new file is uploaded
    if (req.file) {
      const uploadedImg = await uploadOnCloudinary(req.file.path);
      if (uploadedImg) {
        section.BgImg = uploadedImg.secure_url;
      }
    }

    await section.save();

    res.status(200).json({
      success: true,
      message: "Catagory section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("❌ Error updating Catagory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Catagory Section
// @route   DELETE /api/v1/home/catagory
// @access  Private/Admin
// ==========================================
export const deleteCatagory = async (req, res) => {
  try {
    const deletedSection = await Catagory.findOneAndDelete();
    
    if (!deletedSection) {
      return res.status(404).json({ success: false, error: "Catagory section not found." });
    }

    res.status(200).json({
      success: true,
      message: "Catagory section deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting Catagory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};