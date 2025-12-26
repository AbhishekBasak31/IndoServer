import { DirectorSec } from "../../../Model/Homepage/DirectorsSec/DirectorsSec.js";

// --- CREATE ---
export const createDirectorSec = async (req, res) => {
  try {
    const { MainHtext, MainDtext } = req.body;

    if (!MainHtext || !MainDtext) {
      return res.status(400).json({ success: false, message: "Heading and Description are required" });
    }

    const newSection = new DirectorSec({
      MainHtext,
      MainDtext,
      Directors: [] 
    });

    await newSection.save();

    return res.status(201).json({
      success: true,
      message: "Director section created successfully",
      data: newSection,
    });

  } catch (error) {
    console.error("Create DirectorSec Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- READ (Populated) ---
export const getDirectorSec = async (req, res) => {
  try {
    // Populate uses the 'ref' defined in schema ("Director")
    const section = await DirectorSec.findOne().populate("Directors");

    if (!section) {
      return res.status(200).json({ success: true, data: null });
    }

    return res.status(200).json({
      success: true,
      data: section,
    });

  } catch (error) {
    console.error("Get DirectorSec Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- UPDATE ---
export const updateDirectorSec = async (req, res) => {
  try {
    const { id } = req.params;
    const { MainHtext, MainDtext } = req.body;

    const section = await DirectorSec.findById(id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    if (MainHtext) section.MainHtext = MainHtext;
    if (MainDtext) section.MainDtext = MainDtext;

    await section.save();

    return res.status(200).json({
      success: true,
      message: "Director section updated successfully",
      data: section,
    });

  } catch (error) {
    console.error("Update DirectorSec Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- DELETE ---
export const deleteDirectorSec = async (req, res) => {
  try {
    const { id } = req.params;
    await DirectorSec.findByIdAndDelete(id);
    
    return res.status(200).json({ 
      success: true, 
      message: "Director section deleted successfully" 
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};