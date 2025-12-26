import { Tyre } from "../../../Model/Global/Tyres/Tyres.js"; // Adjust path
import { Brand } from "../../../Model/Global/Brand/Brand.js"; // Adjust path
import { VehicleType } from "../../../Model/Global/VehicleType/VehicleType.js"; // Adjust path
import uploadOnCloudinary from "../../../Utils/Cloudinary.js"; // Adjust path
import mongoose from "mongoose";



// --- GET ALL TYRES ---
export const getAllTyres = async (req, res) => {
  try {
    const { page = 1, limit = 10, brand, vehicleType, popular } = req.query;
    
    // Build Query
    const query = {};
    if (brand) query.brand = brand;
    if (vehicleType) query.vehicleTypes = vehicleType;
    if (popular === 'true') query.popular = true;

    const tyres = await Tyre.find(query)
      .populate('brand') // Populate Name and Slug from Brand
      .populate('vehicleTypes' )
      .populate('dealer') // Assuming Dealer model has these fields
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Tyre.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: tyres,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count
    });

  } catch (error) {
    console.error("Get All Tyres Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- GET SINGLE TYRE (By Slug or ID) ---
export const getTyre = async (req, res) => {
  try {
    const { id } = req.params;
    const isId = mongoose.isValidObjectId(id);
    const query = isId ? { _id: id } : { slug: id };

    const tyre = await Tyre.findOne(query)
      .populate('brand')
      .populate('vehicleTypes')
      .populate('dealer');

    if (!tyre) {
      return res.status(404).json({ success: false, message: "Tyre not found" });
    }

    return res.status(200).json({ success: true, data: tyre });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// --- CREATE TYRE ---
export const createTyre = async (req, res) => {
  try {
    const { 
      slug, name, brand, vehicleTypes, size, price, oldPrice, 
      discount, rating, dealer, stock, popular, description,
      techspec, compatibility // These will come as JSON strings
    } = req.body;

    // 1. Basic Validation
    if (!slug || !name || !brand || !vehicleTypes || !price || !oldPrice || !rating || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 2. File Validation
    if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3 || !req.files.image4 || !req.files.image5) {
      return res.status(400).json({ success: false, message: "All 5 images are required" });
    }

    // 3. Duplicate Check
    const existingTyre = await Tyre.findOne({ slug });
    if (existingTyre) {
      return res.status(400).json({ success: false, message: "Tyre with this slug already exists" });
    }

    // 4. Parse JSON fields (Techspec & Compatibility)
    let parsedTechSpec = [];
    let parsedCompatibility = [];
    try {
      if (techspec) parsedTechSpec = JSON.parse(techspec);
      if (compatibility) parsedCompatibility = JSON.parse(compatibility);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid JSON format for specs or compatibility" });
    }

    // 5. Upload Images
    const uploadFile = async (fileArray) => {
      const file = fileArray[0];
      const response = await uploadOnCloudinary(file.path);
      return response ? response.secure_url : null;
    };

    const img1Url = await uploadFile(req.files.image1);
    const img2Url = await uploadFile(req.files.image2);
    const img3Url = await uploadFile(req.files.image3);
    const img4Url = await uploadFile(req.files.image4);
    const img5Url = await uploadFile(req.files.image5);

    // 6. Create Document
    const newTyre = new Tyre({
      slug, name, brand, vehicleTypes, size, price, oldPrice,
      discount: discount || null,
      rating, dealer: dealer || null,
      stock: stock === 'true' || stock === true,
      popular: popular === 'true' || popular === true,
      description,
      techspec: parsedTechSpec,        // ✅ Added
      compatibility: parsedCompatibility, // ✅ Added
      image1: img1Url, image2: img2Url, image3: img3Url, image4: img4Url, image5: img5Url,
    });

    const savedTyre = await newTyre.save();

    // Auto-Link
    if (brand) await Brand.findByIdAndUpdate(brand, { $push: { Tyres: savedTyre._id } });
    if (vehicleTypes) await VehicleType.findByIdAndUpdate(vehicleTypes, { $push: { Tyres: savedTyre._id } });

    return res.status(201).json({ success: true, message: "Tyre created", data: savedTyre });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- UPDATE TYRE ---
export const updateTyre = async (req, res) => {
  try {
    const { id } = req.params;
    const tyre = await Tyre.findById(id);

    if (!tyre) return res.status(404).json({ success: false, message: "Tyre not found" });

    const updates = { ...req.body };

    // ✅ Parse Arrays if present
    if (updates.techspec) updates.techspec = JSON.parse(updates.techspec);
    if (updates.compatibility) updates.compatibility = JSON.parse(updates.compatibility);

    // Handle Images
    if (req.files) {
      const uploadFile = async (field) => {
        if (req.files[field]) {
          const response = await uploadOnCloudinary(req.files[field][0].path);
          if (response) updates[field] = response.secure_url;
        }
      };
      await Promise.all(['image1', 'image2', 'image3', 'image4', 'image5'].map(field => uploadFile(field)));
    }

    const updatedTyre = await Tyre.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({ success: true, message: "Updated", data: updatedTyre });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// --- DELETE TYRE ---
export const deleteTyre = async (req, res) => {
  try {
    const { id } = req.params;
    const tyre = await Tyre.findByIdAndDelete(id);

    if (!tyre) {
      return res.status(404).json({ success: false, message: "Tyre not found" });
    }

    // AUTO-UNLINK: Remove from Brand and VehicleType
    if (tyre.brand) {
      await Brand.findByIdAndUpdate(tyre.brand, { $pull: { Tyres: id } });
    }
    if (tyre.vehicleTypes) {
      await VehicleType.findByIdAndUpdate(tyre.vehicleTypes, { $pull: { Tyres: id } });
    }

    return res.status(200).json({
      success: true,
      message: "Tyre deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};