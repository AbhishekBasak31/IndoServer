import { TyreGuide } from "../../Model/TyreguidePage/Tyreguide.js";

// ============================
// Create Tyre Guide
// ============================
export const createTyreGuide = async (req, res) => {
  try {
    const { 
      MainHtext1, MainDtext, MainHtext2,
      CardHtext1, CardDtext1, CardHtext2, CardDtext2,
      CardHtext3, CardDtext3, CardHtext4, CardDtext4,
      CardHtext5, CardDtext5, CardHtext6, CardDtext6,
      MainHtext3, MainDtext1,
      TableHtext1, TableHtext2, TableHtext3,
      row 
    } = req.body;

    // Check if a guide already exists (Singleton pattern - optional)
    // const existingGuide = await TyreGuide.findOne();
    // if (existingGuide) return res.status(400).json({ error: "Tyre Guide already exists. Please update instead." });

    const newGuide = new TyreGuide({
      MainHtext1, MainDtext, MainHtext2,
      CardHtext1, CardDtext1, CardHtext2, CardDtext2,
      CardHtext3, CardDtext3, CardHtext4, CardDtext4,
      CardHtext5, CardDtext5, CardHtext6, CardDtext6,
      MainHtext3, MainDtext1,
      TableHtext1, TableHtext2, TableHtext3,
      row
    });

    await newGuide.save();

    return res.status(201).json({
      success: true,
      message: "Tyre Guide created successfully",
      data: newGuide,
    });
  } catch (err) {
    console.error("Create Tyre Guide Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// Get Tyre Guide
// ============================
export const getTyreGuide = async (req, res) => {
  try {
    // Assuming we want the latest guide or just one
    const guide = await TyreGuide.findOne().sort({ createdAt: -1 });

    if (!guide) {
      return res.status(404).json({ success: false, message: "Tyre Guide not found" });
    }

    return res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (err) {
    console.error("Get Tyre Guide Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// Update Tyre Guide
// ============================
export const updateTyreGuide = async (req, res) => {
  try {
    const updateData = req.body;

    // Updates the most recent document found
    const updatedGuide = await TyreGuide.findOneAndUpdate({}, updateData, {
      new: true, 
      sort: { createdAt: -1 }, // Ensures we update the latest one
      runValidators: true,
    });

    if (!updatedGuide) {
      return res.status(404).json({ success: false, message: "Tyre Guide not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Tyre Guide updated successfully",
      data: updatedGuide,
    });
  } catch (err) {
    console.error("Update Tyre Guide Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// Delete Tyre Guide (Singleton)
// ============================
export const deleteTyreGuide = async (req, res) => {
  try {
    // Deletes the most recent document
    const deletedGuide = await TyreGuide.findOneAndDelete({}, { sort: { createdAt: -1 } });

    if (!deletedGuide) {
      return res.status(404).json({ success: false, message: "Tyre Guide not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Tyre Guide deleted successfully",
    });
  } catch (err) {
    console.error("Delete Tyre Guide Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};