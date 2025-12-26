import { Brand } from "../../../Model/Global/Brand/Brand.js"; 
import { Tyre } from "../../../Model/Global/Tyres/Tyres.js";
import uploadOnCloudinary from "../../../Utils/Cloudinary.js"; 

// --- CREATE ---
export const createBrand = async (req, res) => {
  try {
    const { Name, slug } = req.body;

    if (!Name || !slug) {
      return res.status(400).json({ success: false, message: "Brand Name and Slug are required" });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Brand Logo/Image is required" });
    }

    const sanitizedSlug = slug.toLowerCase().trim().replace(/\s+/g, '-');
    
    const existingBrand = await Brand.findOne({ slug: sanitizedSlug });
    if (existingBrand) {
      return res.status(400).json({ success: false, message: "Brand with this slug already exists" });
    }

    const uploadResponse = await uploadOnCloudinary(req.file.path);
    if (!uploadResponse) {
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }

    const newBrand = new Brand({
      Name,
      slug: sanitizedSlug,
      Img: uploadResponse.secure_url,
      Tyres: [] 
    });

    await newBrand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: newBrand,
    });

  } catch (error) {
    console.error("Create Brand Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- READ ALL ---
export const getAllBrands = async (req, res) => {
  try {
    // Populate 'Tyres' just to get the count or details if needed, 
    // though just .length usually suffices if not populated.
    const brands = await Brand.find().sort({ createdAt: -1 }).populate("Tyres");
    
    return res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    console.error("Get Brands Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- READ SINGLE (By Slug) ---
export const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await Brand.findOne({ slug }).populate("Tyres");

    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- UPDATE ---
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, slug } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    if (Name) brand.Name = Name;

    if (slug) {
      const sanitizedSlug = slug.toLowerCase().trim().replace(/\s+/g, '-');
      if (sanitizedSlug !== brand.slug) {
        const existing = await Brand.findOne({ slug: sanitizedSlug });
        if (existing) {
          return res.status(400).json({ success: false, message: "Slug already exists" });
        }
        brand.slug = sanitizedSlug;
      }
    }

    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        brand.Img = uploadResponse.secure_url;
      }
    }

    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });

  } catch (error) {
    console.error("Update Brand Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- DELETE (Cascading) ---
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the Brand first to access its Tyres array
    const brandToDelete = await Brand.findById(id);

    if (!brandToDelete) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    // 2. DELETE ALL ASSOCIATED TYRES
    // We utilize deleteMany with the $in operator to find all tyres listed in the brand's array
    if (brandToDelete.Tyres && brandToDelete.Tyres.length > 0) {
        await Tyre.deleteMany({ _id: { $in: brandToDelete.Tyres } });
    }

    // 3. Delete the Brand Document
    await Brand.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Brand and ${brandToDelete.Tyres.length} associated tyres deleted successfully`,
    });

  } catch (error) {
    console.error("Delete Brand Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};