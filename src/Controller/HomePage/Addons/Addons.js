import { Addon } from "../../../Model/Homepage/Addons/Addons.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create Addon Section (Singleton)
// @route   POST /api/v1/home/addon
// ==========================================
export const createAddon = async (req, res) => {
  try {
    // 1. Check if section already exists
    const existing = await Addon.findOne();
    if (existing) {
      return res.status(400).json({ success: false, error: "Addon section already exists. Use update instead." });
    }

    // 2. Extract Text Fields
    const { 
      MainHtext,
      Card1Htext, Card1Dtext,
      Card2Htext, Card2Dtext,
      Card3Htext, Card3Dtext,
      Card4Htext, Card4Dtext 
    } = req.body;

    // 3. Validation
    if (
      !MainHtext || 
      !Card1Htext || !Card1Dtext || 
      !Card2Htext || !Card2Dtext || 
      !Card3Htext || !Card3Dtext || 
      !Card4Htext || !Card4Dtext
    ) {
      return res.status(400).json({ success: false, error: "All Heading and Description fields are required." });
    }

    // 4. Handle Icon Uploads
    const files = req.files || {};

    const uploadIcon = async (fileKey) => {
      if (files[fileKey] && files[fileKey][0]) {
        return await uploadOnCloudinary(files[fileKey][0].path);
      }
      return null;
    };

    const icon1 = await uploadIcon("Card1Icon");
    const icon2 = await uploadIcon("Card2Icon");
    const icon3 = await uploadIcon("Card3Icon");
    const icon4 = await uploadIcon("Card4Icon");

    if (!icon1 || !icon2 || !icon3 || !icon4) {
      return res.status(400).json({ success: false, error: "All 4 Card Icons are required." });
    }

    // 5. Save to DB
    const newAddon = new Addon({
      MainHtext,
      Card1Htext, Card1Dtext, Card1Icon: icon1.secure_url,
      Card2Htext, Card2Dtext, Card2Icon: icon2.secure_url,
      Card3Htext, Card3Dtext, Card3Icon: icon3.secure_url,
      Card4Htext, Card4Dtext, Card4Icon: icon4.secure_url,
    });

    await newAddon.save();

    res.status(201).json({
      success: true,
      message: "Addon Section created successfully",
      data: newAddon,
    });
  } catch (error) {
    console.error("❌ Error creating Addon:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Addon Section
// @route   GET /api/v1/home/addon
// ==========================================
export const getAddon = async (req, res) => {
  try {
    const addon = await Addon.findOne();
    
    if (!addon) {
      return res.status(404).json({ success: false, message: "Addon section not found." });
    }

    res.status(200).json({
      success: true,
      data: addon,
    });
  } catch (error) {
    console.error("❌ Error fetching Addon:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Addon Section
// @route   PATCH /api/v1/home/addon
// ==========================================
export const updateAddon = async (req, res) => {
  try {
    const addon = await Addon.findOne();
    if (!addon) {
      return res.status(404).json({ success: false, error: "Addon section not found." });
    }

    const { 
      MainHtext,
      Card1Htext, Card1Dtext,
      Card2Htext, Card2Dtext,
      Card3Htext, Card3Dtext,
      Card4Htext, Card4Dtext 
    } = req.body;

    const files = req.files || {};

    // --- Update Text Fields ---
    if (MainHtext) addon.MainHtext = MainHtext;
    
    if (Card1Htext) addon.Card1Htext = Card1Htext;
    if (Card1Dtext) addon.Card1Dtext = Card1Dtext;

    if (Card2Htext) addon.Card2Htext = Card2Htext;
    if (Card2Dtext) addon.Card2Dtext = Card2Dtext;

    if (Card3Htext) addon.Card3Htext = Card3Htext;
    if (Card3Dtext) addon.Card3Dtext = Card3Dtext;

    if (Card4Htext) addon.Card4Htext = Card4Htext;
    if (Card4Dtext) addon.Card4Dtext = Card4Dtext;

    // --- Update Icons (if provided) ---
    if (files["Card1Icon"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Card1Icon"][0].path);
      if (upload) addon.Card1Icon = upload.secure_url;
    }

    if (files["Card2Icon"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Card2Icon"][0].path);
      if (upload) addon.Card2Icon = upload.secure_url;
    }

    if (files["Card3Icon"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Card3Icon"][0].path);
      if (upload) addon.Card3Icon = upload.secure_url;
    }

    if (files["Card4Icon"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Card4Icon"][0].path);
      if (upload) addon.Card4Icon = upload.secure_url;
    }

    await addon.save();

    res.status(200).json({
      success: true,
      message: "Addon Section updated successfully",
      data: addon,
    });
  } catch (error) {
    console.error("❌ Error updating Addon:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Addon Section
// @route   DELETE /api/v1/home/addon
// ==========================================
export const deleteAddon = async (req, res) => {
  try {
    const deleted = await Addon.findOneAndDelete();
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Section not found." });
    }

    res.status(200).json({
      success: true,
      message: "Addon section deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting Addon:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};