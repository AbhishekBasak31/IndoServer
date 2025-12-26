import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createCatagory,
  getCatagory,
  updateCatagory,
  deleteCatagory,
} from "../../../Controller/HomePage/Catagory/Catagory.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const HomeCatagoryrouter = express.Router();

// Define 'BgImg' as the expected file field name
const uploadBg = upload.single("BgImg");

// Routes (Singleton pattern, no ID needed in URL)
HomeCatagoryrouter.post("/",authenticate, uploadBg, createCatagory);
HomeCatagoryrouter.get("/", getCatagory);
HomeCatagoryrouter.patch("/",authenticate, uploadBg, updateCatagory);
HomeCatagoryrouter.delete("/",authenticate, deleteCatagory);

export default HomeCatagoryrouter;