import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import { 
  createBrand, 
  getAllBrands, 
  getBrandBySlug, 
  updateBrand, 
  deleteBrand 
} from "../../../Controller/Global/Brand/Brand.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Brandrouter = express.Router();

// Route Base: /api/v1/brand

// Create (Image Required)
Brandrouter.post("/",authenticate, upload.single("Img"), createBrand);

// Get All
Brandrouter.get("/", getAllBrands);

// Get Single by Slug (Public access usually)
Brandrouter.get("/:slug", getBrandBySlug);

// Update (ID Required, Image Optional)
Brandrouter.patch("/:id",authenticate, upload.single("Img"), updateBrand);

// Delete
Brandrouter.delete("/:id",authenticate, deleteBrand);

export default Brandrouter;