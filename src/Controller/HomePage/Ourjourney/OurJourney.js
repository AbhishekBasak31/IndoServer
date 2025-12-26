import { Ourjourney} from "../../../Model/Homepage/OurJourney/OurJouney.js";



export const createOurJourney = async (req, res) => {
  try {
    const { Htext, Dtext } = req.body;

    if (!Htext || !Dtext) {
      return res.status(400).json({ success: false, message: "Heading and Description are required" });
    }

    // Optional: Check if one already exists to enforce Singleton
    const existing = await Ourjourney.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Section already exists. Please update instead." });
    }

    const newJourney = new Ourjourney({
      Htext,
      Dtext
    });

    await newJourney.save();

    return res.status(201).json({
      success: true,
      message: "Journey section created successfully",
      data: newJourney,
    });

  } catch (error) {
    console.error("Create OurJourney Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- READ (Get Single) ---
export const getOurJourney = async (req, res) => {
  try {
    // Finds the first document
    const journey = await Ourjourney.findOne();

    if (!journey) {
      return res.status(200).json({ success: true, data: null });
    }

    return res.status(200).json({
      success: true,
      data: journey,
    });
  } catch (error) {
    console.error("Get OurJourney Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- UPDATE (No ID required) ---
export const updateOurJourney = async (req, res) => {
  try {
    const { Htext, Dtext } = req.body;

    // Find the first document
    const journey = await Ourjourney.findOne();

    if (!journey) {
      return res.status(404).json({ success: false, message: "Journey section not found. Please create it first." });
    }

    if (Htext) journey.Htext = Htext;
    if (Dtext) journey.Dtext = Dtext;

    await journey.save();

    return res.status(200).json({
      success: true,
      message: "Journey section updated successfully",
      data: journey,
    });

  } catch (error) {
    console.error("Update OurJourney Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- DELETE (No ID required) ---
export const deleteOurJourney = async (req, res) => {
  try {
    // Deletes the first document found
    const deletedJourney = await Ourjourney.findOneAndDelete();

    if (!deletedJourney) {
      return res.status(404).json({ success: false, message: "Journey section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Journey section deleted successfully",
    });

  } catch (error) {
    console.error("Delete OurJourney Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};