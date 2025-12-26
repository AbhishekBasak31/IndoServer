import { Director } from "../../../Model/Global/Directors/Directors.js";
import { DirectorSec } from "../../../Model/Homepage/DirectorsSec/DirectorsSec.js"; // Import DirectorSec to update the list
import uploadOnCloudinary from "../../../Utils/Cloudinary.js"; // Default import

// --- CREATE ---
export const createDirector = async (req, res) => {
  try {
    const { Name, Desig } = req.body;

    if (!Name || !Desig) {
      return res.status(400).json({ success: false, message: "Name and Designation are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Director image is required" });
    }

    const uploadResponse = await uploadOnCloudinary(req.file.path);
    if (!uploadResponse) {
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }

    const newDirector = new Director({
      Name,
      Desig,
      Img: uploadResponse.secure_url,
    });

    const savedDirector = await newDirector.save();

    // AUTO-LINK: Push ID to DirectorSec
    await DirectorSec.findOneAndUpdate(
      {}, 
      { $push: { Directors: savedDirector._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Director added successfully",
      data: savedDirector,
    });

  } catch (error) {
    console.error("Create Director Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- READ ALL ---
export const getAllDirectors = async (req, res) => {
  try {
    const directors = await Director.find();
    return res.status(200).json({ success: true, data: directors });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- UPDATE ---
export const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Desig } = req.body;

    const director = await Director.findById(id);
    if (!director) {
      return res.status(404).json({ success: false, message: "Director not found" });
    }

    if (Name) director.Name = Name;
    if (Desig) director.Desig = Desig;

    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        director.Img = uploadResponse.secure_url;
      }
    }

    await director.save();

    return res.status(200).json({
      success: true,
      message: "Director updated successfully",
      data: director,
    });

  } catch (error) {
    console.error("Update Director Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- DELETE ---
export const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDirector = await Director.findByIdAndDelete(id);

    if (!deletedDirector) {
      return res.status(404).json({ success: false, message: "Director not found" });
    }

    // AUTO-UNLINK: Remove ID from DirectorSec
    await DirectorSec.findOneAndUpdate(
      {},
      { $pull: { Directors: id } }
    );

    return res.status(200).json({
      success: true,
      message: "Director deleted successfully",
    });

  } catch (error) {
    console.error("Delete Director Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};