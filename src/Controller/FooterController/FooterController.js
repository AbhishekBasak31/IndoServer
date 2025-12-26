import { Footer } from "../../Model/Global/Footer/Footer.js"; // Adjust path as needed
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create a new Footer entry
// @route   POST /api/footer
// @access  Private/Admin
// ==========================================
export const createFooter = async (req, res) => {
  try {
    const { copyright, Dtext } = req.body;

    // 1. Validation
    if (!copyright || !Dtext) {
      return res.status(400).json({
        success: false,
        error: "Copyright and Description Text (Dtext) are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Logo image is required.",
      });
    }

    // 2. Prevent Multiple Footers (Optional, usually strict for Footers)
    const existing = await Footer.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Footer already exists. Please update the existing one.",
      });
    }

    // 3. Upload Logo
    const uploadedLogo = await uploadOnCloudinary(req.file.path);
    if (!uploadedLogo) {
      return res.status(500).json({ success: false, error: "Logo upload failed" });
    }

    // 4. Create Footer
    // Note: socials and quickLinks are ignored here as requested
    const footer = new Footer({
      logo: uploadedLogo.secure_url,
      copyright,
      Dtext,
    });

    const savedFooter = await footer.save();

    return res.status(201).json({
      success: true,
      message: "Footer created successfully",
      data: savedFooter,
    });
  } catch (error) {
    console.error("❌ Error creating footer:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Get all footers
// @route   GET /api/footer
// @access  Public
// ==========================================
export const getAllFooters = async (req, res) => {
  try {
    // We populate socials and quickLinks just in case you need to display them
    // Ensure the models 'Social' and 'QuickLink' exist if you use populate
    const footers = await Footer.find()
      .populate("socials") 
      .populate("quickLinks");

    res.status(200).json({
      success: true,
      count: footers.length,
      data: footers,
    });
  } catch (error) {
    console.error("❌ Error fetching footers:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Update footer by ID
// @route   PATCH /api/footer/:id
// @access  Private/Admin
// ==========================================
export const updateFooter = async (req, res) => {
  try {
    const footerId = req.params.id;
    const { copyright, Dtext } = req.body;

    const footer = await Footer.findById(footerId);
    if (!footer) {
      return res.status(404).json({ success: false, error: "Footer not found" });
    }

    // 1. Update Text Fields
    if (copyright) footer.copyright = copyright;
    if (Dtext) footer.Dtext = Dtext;

    // 2. Update Logo if a new file is sent
    if (req.file) {
      const uploadedLogo = await uploadOnCloudinary(req.file.path);
      if (uploadedLogo) {
        footer.logo = uploadedLogo.secure_url;
      }
    }

    const updatedFooter = await footer.save();

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: updatedFooter,
    });
  } catch (error) {
    console.error("❌ Error updating footer:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Delete footer by ID
// @route   DELETE /api/footer/:id
// @access  Private/Admin
// ==========================================
export const deleteFooter = async (req, res) => {
  try {
    const deletedFooter = await Footer.findByIdAndDelete(req.params.id);
    if (!deletedFooter) {
      return res.status(404).json({
        success: false,
        error: "Footer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Footer deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting footer:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};