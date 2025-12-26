import { Journey } from "../../../Model/Homepage/Journey/Journey.js";
import uploadOnCloudinary from "../../../Utils/Cloudinary.js"; // ✅ Default import

export const createJourney = async (req, res) => {
  try {
    const { year, event } = req.body;

    // 1. Basic Validation
    if (!year || !event) {
      return res.status(400).json({ success: false, message: "Year and Event are required" });
    }

    // 2. Handle Image Upload
    let imageUrl = "";
    
    if (req.file) {
      // Your utility handles the upload AND the fs.unlinkSync cleanup automatically
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      
      if (uploadResponse) {
        imageUrl = uploadResponse.secure_url;
      } else {
        return res.status(500).json({ success: false, message: "Failed to upload image to cloud" });
      }
    } else {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // 3. Save to Database
    const newJourney = new Journey({
      year,
      event,
      Image: imageUrl,
    });

    await newJourney.save();

    return res.status(201).json({
      success: true,
      message: "Journey event created successfully",
      data: newJourney,
    });

  } catch (error) {
    console.error("Create Journey Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllJourneys = async (req, res) => {
  try {
    // Sorted by year (Assuming year is stored as string "YYYY", sort works alphabetically/numerically)
    const journeys = await Journey.find().sort({ year: 1 }); 

    return res.status(200).json({
      success: true,
      data: journeys,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, event } = req.body;

    const journey = await Journey.findById(id);
    if (!journey) {
      return res.status(404).json({ success: false, message: "Journey not found" });
    }

    // Update text fields if provided
    if (year) journey.year = year;
    if (event) journey.event = event;

    // Update Image if a new file is provided
    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        journey.Image = uploadResponse.secure_url;
      }
    }

    await journey.save();

    return res.status(200).json({
      success: true,
      message: "Journey updated successfully",
      data: journey,
    });

  } catch (error) {
    console.error("Update Journey Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJourney = await Journey.findByIdAndDelete(id);

    if (!deletedJourney) {
      return res.status(404).json({ success: false, message: "Journey not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Journey deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};