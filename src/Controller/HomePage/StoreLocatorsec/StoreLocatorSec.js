import { StoreLocatorSec } from "../../../Model/Homepage/StoreLocatorSec/StoreLocatorSec.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create Store Locator Section (Singleton)
// @route   POST /api/v1/home/storelocatorsec
// @access  Private/Admin
// ==========================================
export const createStoreLocatorSec = async (req, res) => {
  try {
    // 1. Check if section already exists
    const existing = await StoreLocatorSec.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Section already exists. Please use update instead.",
      });
    }

    const { MainHtext, Counter1, Counter2, Counter1Text, Counter2Text } = req.body;

    // 2. Validate Text Fields
    if (!MainHtext || !Counter1 || !Counter2 || !Counter1Text || !Counter2Text) {
      return res.status(400).json({ success: false, error: "All text fields are required." });
    }

    // 3. Handle Background Image Upload
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Background Image (BgImg) is required." });
    }

    const uploadedImg = await uploadOnCloudinary(req.file.path);
    if (!uploadedImg) {
      return res.status(500).json({ success: false, error: "Error uploading background image." });
    }

    // 4. Save to DB
    // Note: StoreLocators array is initialized empty or managed by StoreLocator controller
    const newSection = new StoreLocatorSec({
      MainHtext,
      Counter1,
      Counter2,
      Counter1Text,
      Counter2Text,
      BgImg: uploadedImg.secure_url,
      StoreLocators: [], 
    });

    await newSection.save();

    res.status(201).json({
      success: true,
      message: "Store Locator Section created successfully",
      data: newSection,
    });
  } catch (error) {
    console.error("❌ Error creating Store Locator Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Store Locator Section (Populated)
// @route   GET /api/v1/home/storelocatorsec
// @access  Public
// ==========================================
export const getStoreLocatorSec = async (req, res) => {
  try {
    // Populate the 'StoreLocators' array to get details of individual stores
    const section = await StoreLocatorSec.findOne().populate("StoreLocators");
    
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("❌ Error fetching Store Locator Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Store Locator Section
// @route   PATCH /api/v1/home/storelocatorsec
// @access  Private/Admin
// ==========================================
export const updateStoreLocatorSec = async (req, res) => {
  try {
    const section = await StoreLocatorSec.findOne();
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found." });
    }

    const { MainHtext, Counter1, Counter2, Counter1Text, Counter2Text } = req.body;

    // Update Text Fields
    if (MainHtext) section.MainHtext = MainHtext;
    if (Counter1) section.Counter1 = Counter1;
    if (Counter2) section.Counter2 = Counter2;
    if (Counter1Text) section.Counter1Text = Counter1Text;
    if (Counter2Text) section.Counter2Text = Counter2Text;

    // Update Background Image if new file provided
    if (req.file) {
      const uploadedImg = await uploadOnCloudinary(req.file.path);
      if (uploadedImg) {
        section.BgImg = uploadedImg.secure_url;
      }
    }

    await section.save();

    res.status(200).json({
      success: true,
      message: "Store Locator Section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("❌ Error updating Store Locator Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Store Locator Section
// @route   DELETE /api/v1/home/storelocatorsec
// @access  Private/Admin
// ==========================================
export const deleteStoreLocatorSec = async (req, res) => {
  try {
    const deletedSection = await StoreLocatorSec.findOneAndDelete();
    
    if (!deletedSection) {
      return res.status(404).json({ success: false, error: "Section not found." });
    }

    res.status(200).json({
      success: true,
      message: "Store Locator Section deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting Store Locator Section:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};