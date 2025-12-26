import { ReviewSection } from "../../../Model/Homepage/ReviewSec/ReviewSec.js";

// ==========================================
// @desc    Create Review Section (Singleton)
// @route   POST /api/v1/home/reviewsec
// ==========================================
export const createReviewSection = async (req, res) => {
  try {
    const existing = await ReviewSection.findOne();
    if (existing) {
      return res.status(400).json({ success: false, error: "Section already exists." });
    }

    const { Htext } = req.body;
    if (!Htext) return res.status(400).json({ success: false, error: "Htext is required" });

    const newSection = new ReviewSection({
      Htext,
      Reviews: [] // Starts empty, filled by ReviewController
    });

    await newSection.save();
    res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Review Section (Populated)
// @route   GET /api/v1/home/reviewsec
// ==========================================
export const getReviewSection = async (req, res) => {
  try {
    const section = await ReviewSection.findOne()
      .populate({
        path: "Reviews",
        match: { active: true }, // Only return active reviews
        options: { sort: { createdAt: -1 } } // Newest first
      });
    
    if (!section) return res.status(404).json({ success: false, error: "Section not found" });

    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Review Section (Htext)
// @route   PATCH /api/v1/home/reviewsec
// ==========================================
export const updateReviewSection = async (req, res) => {
  try {
    const { Htext } = req.body;
    const section = await ReviewSection.findOne();
    
    if (!section) return res.status(404).json({ success: false, error: "Section not found" });

    if (Htext) section.Htext = Htext;
    await section.save();

    res.status(200).json({ success: true, message: "Updated successfully", data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Review Section
// @route   DELETE /api/v1/home/reviewsec
// ==========================================
export const deleteReviewSection = async (req, res) => {
  try {
    await ReviewSection.findOneAndDelete();
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};