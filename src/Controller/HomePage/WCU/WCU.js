import { Whychooseus } from "../../../Model/Homepage/WCU/WCU.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create Why Choose Us Section (Singleton)
// @route   POST /api/v1/home/whychooseus
// @access  Private/Admin
// ==========================================
export const createWhyChooseUs = async (req, res) => {
  try {
    // 1. Check if section already exists
    const existing = await Whychooseus.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Section already exists. Please use update instead.",
      });
    }

    const { 
      MainHtext, 
      Htext1, Dtext1, 
      Htext2, Dtext2, 
      Htext3, Dtext3, 
      Htext4, Dtext4 
    } = req.body;

    // 2. Validate Text Fields
    if (!MainHtext || !Htext1 || !Dtext1 || !Htext2 || !Dtext2 || !Htext3 || !Dtext3 || !Htext4 || !Dtext4) {
      return res.status(400).json({ success: false, error: "All text fields are required." });
    }

    // 3. Handle 4 Icon Uploads
    const files = req.files || {};
    const icon1File = files["Icon1"]?.[0];
    const icon2File = files["Icon2"]?.[0];
    const icon3File = files["Icon3"]?.[0];
    const icon4File = files["Icon4"]?.[0];

    if (!icon1File || !icon2File || !icon3File || !icon4File) {
      return res.status(400).json({ success: false, error: "All 4 icons are required." });
    }

    // Upload to Cloudinary
    const icon1Url = await uploadOnCloudinary(icon1File.path);
    const icon2Url = await uploadOnCloudinary(icon2File.path);
    const icon3Url = await uploadOnCloudinary(icon3File.path);
    const icon4Url = await uploadOnCloudinary(icon4File.path);

    if (!icon1Url || !icon2Url || !icon3Url || !icon4Url) {
      return res.status(500).json({ success: false, error: "Error uploading icons." });
    }

    // 4. Save
    const newSection = new Whychooseus({
      MainHtext,
      Htext1, Dtext1, Icon1: icon1Url.secure_url,
      Htext2, Dtext2, Icon2: icon2Url.secure_url,
      Htext3, Dtext3, Icon3: icon3Url.secure_url,
      Htext4, Dtext4, Icon4: icon4Url.secure_url,
    });

    await newSection.save();

    res.status(201).json({
      success: true,
      message: "Why Choose Us section created successfully",
      data: newSection,
    });
  } catch (error) {
    console.error("❌ Error creating Why Choose Us:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Why Choose Us Section
// @route   GET /api/v1/home/whychooseus
// @access  Public
// ==========================================
export const getWhyChooseUs = async (req, res) => {
  try {
    const section = await Whychooseus.findOne();
    
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("❌ Error fetching Why Choose Us:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Why Choose Us Section (Singleton)
// @route   PATCH /api/v1/home/whychooseus
// @access  Private/Admin
// ==========================================
export const updateWhyChooseUs = async (req, res) => {
  try {
    const section = await Whychooseus.findOne();
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found." });
    }

    const body = req.body;

    // Update Text Fields dynamically if present
    if (body.MainHtext) section.MainHtext = body.MainHtext;
    if (body.Htext1) section.Htext1 = body.Htext1;
    if (body.Dtext1) section.Dtext1 = body.Dtext1;
    if (body.Htext2) section.Htext2 = body.Htext2;
    if (body.Dtext2) section.Dtext2 = body.Dtext2;
    if (body.Htext3) section.Htext3 = body.Htext3;
    if (body.Dtext3) section.Dtext3 = body.Dtext3;
    if (body.Htext4) section.Htext4 = body.Htext4;
    if (body.Dtext4) section.Dtext4 = body.Dtext4;

    // Update Icons if new files provided
    const files = req.files || {};

    if (files["Icon1"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Icon1"][0].path);
      if (upload) section.Icon1 = upload.secure_url;
    }
    if (files["Icon2"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Icon2"][0].path);
      if (upload) section.Icon2 = upload.secure_url;
    }
    if (files["Icon3"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Icon3"][0].path);
      if (upload) section.Icon3 = upload.secure_url;
    }
    if (files["Icon4"]?.[0]) {
      const upload = await uploadOnCloudinary(files["Icon4"][0].path);
      if (upload) section.Icon4 = upload.secure_url;
    }

    await section.save();

    res.status(200).json({
      success: true,
      message: "Why Choose Us updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("❌ Error updating Why Choose Us:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Why Choose Us Section
// @route   DELETE /api/v1/home/whychooseus
// @access  Private/Admin
// ==========================================
export const deleteWhyChooseUs = async (req, res) => {
  try {
    const deletedSection = await Whychooseus.findOneAndDelete();
    
    if (!deletedSection) {
      return res.status(404).json({ success: false, error: "Section not found." });
    }

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting Why Choose Us:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};