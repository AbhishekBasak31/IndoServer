import { QuickLink } from "../../Model/Global/QuickLink/QuickLink.js"; // Adjust path if needed
import { Footer } from "../../Model/Global/Footer/Footer.js";       // Import Footer model to update references

// ==========================================
// @desc    Create a new Quick Link and add to Footer
// @route   POST /api/quicklink
// @access  Private/Admin
// ==========================================
export const createQuickLink = async (req, res) => {
  try {
    const { Name, link } = req.body;

    if (!Name || !link) {
      return res.status(400).json({
        success: false,
        error: "Name and Link are required.",
      });
    }

    // 1. Create the QuickLink document
    const newLink = new QuickLink({
      Name,
      link,
    });
    const savedLink = await newLink.save();

    // 2. Add the reference to the main Footer document
    // We assume there is one main footer. We find the first one.
    const footer = await Footer.findOne();
    
    if (footer) {
      footer.quickLinks.push(savedLink._id);
      await footer.save();
    } else {
      // Optional: You might want to warn if no footer exists to attach to
      console.warn("⚠️ No Footer document found to attach the QuickLink.");
    }

    return res.status(201).json({
      success: true,
      message: "Quick Link created and added to Footer successfully",
      data: savedLink,
    });
  } catch (error) {
    console.error("❌ Error creating Quick Link:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Get all Quick Links
// @route   GET /api/quicklink
// @access  Public
// ==========================================
export const getAllQuickLinks = async (req, res) => {
  try {
    const links = await QuickLink.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    console.error("❌ Error fetching Quick Links:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Update Quick Link
// @route   PATCH /api/quicklink/:id
// @access  Private/Admin
// ==========================================
export const updateQuickLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, link } = req.body;

    const existingLink = await QuickLink.findById(id);

    if (!existingLink) {
      return res.status(404).json({
        success: false,
        error: "Quick Link not found",
      });
    }

    if (Name) existingLink.Name = Name;
    if (link) existingLink.link = link;

    const updatedLink = await existingLink.save();

    res.status(200).json({
      success: true,
      message: "Quick Link updated successfully",
      data: updatedLink,
    });
  } catch (error) {
    console.error("❌ Error updating Quick Link:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Delete Quick Link and remove from Footer
// @route   DELETE /api/quicklink/:id
// @access  Private/Admin
// ==========================================
export const deleteQuickLink = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Delete the QuickLink document
    const deletedLink = await QuickLink.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({
        success: false,
        error: "Quick Link not found",
      });
    }

    // 2. Remove the reference from the Footer document
    await Footer.updateMany(
      {}, // filter (all footers, usually just one)
      { $pull: { quickLinks: id } }
    );

    res.status(200).json({
      success: true,
      message: "Quick Link deleted and removed from Footer successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting Quick Link:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};