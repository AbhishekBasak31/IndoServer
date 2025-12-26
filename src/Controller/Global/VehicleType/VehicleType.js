import mongoose from "mongoose";
import { VehicleType } from "../../../Model/Global/VehicleType/VehicleType.js"; // Adjust path
import { Catagory } from "../../../Model/Homepage/Catagory/Catagory.js";       // Import Catagory to update references
import { Tyre} from "../../../Model/Global/Tyres/Tyres.js"; //
import uploadOnCloudinary from "../../../Utils/Cloudinary.js";

// --- HELPER: Identify by ID or Slug ---
const getQuery = (identifier) => {
  return mongoose.isValidObjectId(identifier) 
    ? { _id: identifier } 
    : { slug: identifier };
};

// ==========================================
// 1. CREATE
// ==========================================
export const createVehicleType = async (req, res) => {
  try {
    const { Name, slug } = req.body;

    // 1. Validation
    if (!Name || !slug) {
      return res.status(400).json({ success: false, error: "Name and Slug are required." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Icon image is required." });
    }

    // 2. Upload Icon
    const uploadedIcon = await uploadOnCloudinary(req.file.path);
    if (!uploadedIcon) {
      return res.status(500).json({ success: false, error: "Icon upload failed." });
    }

    // 3. Create Document
    const newVehicleType = new VehicleType({
      Name,
      slug,
      Icon: uploadedIcon.secure_url,
      Tyres: [] // Starts empty
    });

    const savedType = await newVehicleType.save();

    // 4. AUTO-LINK: Add this Type ID to the main Catagory
    // Assumes there is at least one Category document
    const catagory = await Catagory.findOne();
    if (catagory) {
      catagory.Types.push(savedType._id);
      await catagory.save();
    }

    res.status(201).json({
      success: true,
      message: "Vehicle Type created successfully",
      data: savedType,
    });
  } catch (error) {
    console.error("Create VehicleType Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 2. GET ALL (New)
// ==========================================
export const getAllVehicleTypes = async (req, res) => {
  try {
    // Fetches all types and populates their tyre count
    const vehicleTypes = await VehicleType.find().populate("Tyres");

    res.status(200).json({
      success: true,
      count: vehicleTypes.length,
      data: vehicleTypes,
    });
  } catch (error) {
    console.error("Get All VehicleTypes Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 3. GET SINGLE (By ID or Slug)
// ==========================================
export const getVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getQuery(id);

    const vehicleType = await VehicleType.findOne(query).populate("Tyres");

    if (!vehicleType) {
      return res.status(404).json({ success: false, error: "Vehicle Type not found" });
    }

    res.status(200).json({
      success: true,
      data: vehicleType,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 4. UPDATE
// ==========================================
export const updateVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, slug } = req.body;
    const query = getQuery(id);

    const vehicleType = await VehicleType.findOne(query);

    if (!vehicleType) {
      return res.status(404).json({ success: false, error: "Vehicle Type not found" });
    }

    // Update Fields
    if (Name) vehicleType.Name = Name;
    if (slug) vehicleType.slug = slug;

    // Update Icon if new file provided
    if (req.file) {
      const uploadedIcon = await uploadOnCloudinary(req.file.path);
      if (uploadedIcon) {
        vehicleType.Icon = uploadedIcon.secure_url;
      }
    }

    await vehicleType.save();

    res.status(200).json({
      success: true,
      message: "Vehicle Type updated successfully",
      data: vehicleType,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 5. DELETE (Cascading)
// ==========================================
export const deleteVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getQuery(id);

    // 1. Find the Vehicle Type first
    const typeToDelete = await VehicleType.findOne(query);

    if (!typeToDelete) {
      return res.status(404).json({ success: false, error: "Vehicle Type not found" });
    }

    // 2. DELETE ALL ASSOCIATED TYRES
    // Deletes all tyres whose IDs are in the vehicle type's 'Tyres' array
    if (typeToDelete.Tyres && typeToDelete.Tyres.length > 0) {
        await Tyre.deleteMany({ _id: { $in: typeToDelete.Tyres } });
    }

    // 3. Delete the Vehicle Type Document
    await VehicleType.findByIdAndDelete(typeToDelete._id);

    // 4. Remove Reference from Catagory
    await Catagory.updateMany(
      {}, 
      { $pull: { Types: typeToDelete._id } }
    );

    res.status(200).json({
      success: true,
      message: `Vehicle Type and ${typeToDelete.Tyres.length} associated tyres deleted successfully`,
    });

  } catch (error) {
    console.error("Delete VehicleType Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};