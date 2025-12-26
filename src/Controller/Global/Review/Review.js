import { Review } from "../../../Model/Global/Reviews/Reviews.js";
import { ReviewSection } from "../../../Model/Homepage/ReviewSec/ReviewSec.js"; // Import ReviewSection model

// ==========================================
// @desc    Create Review & Link to ReviewSection
// @route   POST /api/v1/review
// ==========================================
export const createReview = async (req, res) => {
  try {
    const { Rating, Name, Comment, Location } = req.body;

    // 1. Validation
    if (!Rating || !Name || !Comment || !Location) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // 2. Create the Review Document
    const newReview = new Review({
      Rating,
      Name,
      Comment,
      Location,
      active: true, // Default active
    });

    const savedReview = await newReview.save();

    // 3. AUTOMATICALLY PUSH ID TO REVIEW SECTION
    // Find the single ReviewSection document
    const section = await ReviewSection.findOne();
    
    if (section) {
      section.Reviews.push(savedReview._id);
      await section.save();
    } else {
      console.warn("⚠️ No ReviewSection found. Review saved but not linked to home section.");
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Review & Remove from Section
// @route   DELETE /api/v1/review/:id
// ==========================================
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    // Remove reference from ReviewSection
    await ReviewSection.updateMany(
      {}, 
      { $pull: { Reviews: id } }
    );

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get All Reviews (Admin use mostly)
// @route   GET /api/v1/review
// ==========================================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Toggle Active Status
// @route   PATCH /api/v1/review/:id/status
// ==========================================
export const toggleReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, error: "Not found" });

    review.active = !review.active;
    await review.save();

    res.status(200).json({ success: true, message: "Status updated", data: review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};