import { ExpertTalks } from "../../../Model/Homepage/ExpertTalks/ExpertTalks.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create Expert Talks Section
// ==========================================
export const createExpertTalks = async (req, res) => {
  try {
    const existing = await ExpertTalks.findOne();
    if (existing) {
      return res.status(400).json({ success: false, error: "Section already exists. Use update." });
    }

    // ✅ Added youVideoLink to destructuring
    const { Htext, Dtext, Dtext2, youVideoLink } = req.body;

    // Validation
    if (!Htext || !Dtext || !Dtext2 || !youVideoLink) {
      return res.status(400).json({ success: false, error: "All text fields and YouTube link are required." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Preview Video file is required." });
    }

    const uploadedVideo = await uploadOnCloudinary(req.file.path);
    if (!uploadedVideo) return res.status(500).json({ success: false, error: "Upload failed." });

    const newTalk = new ExpertTalks({
      Htext,
      Dtext,
      Dtext2,
      youVideoLink, // ✅ Saved to DB
      Video: uploadedVideo.secure_url,
    });

    await newTalk.save();

    res.status(201).json({ success: true, message: "Created successfully", data: newTalk });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get Expert Talks Section
// ==========================================
export const getExpertTalks = async (req, res) => {
  try {
    const talk = await ExpertTalks.findOne();
    if (!talk) return res.status(404).json({ success: false, message: "Not found." });
    res.status(200).json({ success: true, data: talk });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Expert Talks Section
// ==========================================
export const updateExpertTalks = async (req, res) => {
  try {
    const talk = await ExpertTalks.findOne();
    if (!talk) return res.status(404).json({ success: false, error: "Not found." });

    // ✅ Added youVideoLink to destructuring
    const { Htext, Dtext, Dtext2, youVideoLink } = req.body;

    if (Htext) talk.Htext = Htext;
    if (Dtext) talk.Dtext = Dtext;
    if (Dtext2) talk.Dtext2 = Dtext2;
    if (youVideoLink) talk.youVideoLink = youVideoLink; // ✅ Update Link

    if (req.file) {
      const uploadedVideo = await uploadOnCloudinary(req.file.path);
      if (uploadedVideo) talk.Video = uploadedVideo.secure_url;
    }

    await talk.save();

    res.status(200).json({ success: true, message: "Updated successfully", data: talk });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Expert Talks Section
// ==========================================
export const deleteExpertTalks = async (req, res) => {
  try {
    const deleted = await ExpertTalks.findOneAndDelete();
    if (!deleted) return res.status(404).json({ success: false, error: "Not found." });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};