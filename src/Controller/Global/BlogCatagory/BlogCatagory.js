import { BlogCategory } from "../../../Model/Global/BlogCatagory/BlogCatagory.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    const { Name } = req.body;
    if (!Name) return res.status(400).json({ success: false, message: "Name is required" });

    const slug = slugify(Name);
    const category = new BlogCategory({ Name, slug });
    await category.save();

    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await BlogCategory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};