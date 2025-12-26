import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import { 
  createTyre, 
  getAllTyres, 
  getTyre, 
  updateTyre, 
  deleteTyre 
} from "../../../Controller/Global/Tyres/Tyres.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Tyresrouter = express.Router();

// Route Base: /api/v1/tyre

// Configure Multer for 5 distinct image fields
const cpUpload = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 }
]);

// Create
Tyresrouter.post("/", authenticate,cpUpload, createTyre);

// Read All (supports ?page=1&limit=10&brand=ID)
Tyresrouter.get("/", getAllTyres);

// Read Single (by ID or Slug)
Tyresrouter.get("/:id", getTyre);

// Update
Tyresrouter.patch("/:id",authenticate, cpUpload, updateTyre);

// Delete
Tyresrouter.delete("/:id",authenticate, deleteTyre);

export default Tyresrouter;