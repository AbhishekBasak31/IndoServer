import { Blog } from "../../../Model/Global/Blog/Blog.js";
import uploadOnCloudinary from "../../../Utils/Cloudinary.js"; // Your cleanup utility
// ============================
// Create Blog
// ============================
export const createBlog = async (req, res) => {
  try {
    const { Name, Description, readtime, Category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Blog Image is required" });
    }

    const uploadResponse = await uploadOnCloudinary(req.file.path);
    if (!uploadResponse) {
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }

    const newBlog = new Blog({
      Name,
      Img: uploadResponse.secure_url,
      Description,
      readtime,
      // Handle Category array structure
      Category: Array.isArray(Category) ? Category : [Category] 
    });

    await newBlog.save();

    res.status(201).json({ 
      success: true, 
      message: "Blog created successfully", 
      data: newBlog 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// Update Blog (Fixed)
// ============================
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    let updateData = { ...req.body };

    // Fix Category array issue if coming from FormData
    if (updateData.Category && !Array.isArray(updateData.Category)) {
      updateData.Category = [updateData.Category];
    }

    // ✅ FIXED: Check req.file (singular) because router uses upload.single()
    const imgLocalPath = req.file?.path;

    if (imgLocalPath) {
      const imgUpload = await uploadOnCloudinary(imgLocalPath);
      if (imgUpload) {
        updateData.Img = imgUpload.secure_url;
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedBlog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ 
      success: true, 
      message: "Blog updated successfully", 
      data: updatedBlog 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... (Rest of your read/delete controllers remain the same)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("Category", "Name slug").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("Category", "Name slug");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};