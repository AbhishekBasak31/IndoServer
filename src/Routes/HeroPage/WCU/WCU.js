import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createWhyChooseUs,
  getWhyChooseUs,
  updateWhyChooseUs,
  deleteWhyChooseUs,
} from "../../../Controller/HomePage/WCU/WCU.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const WCUrouter = express.Router();

// Configure Multer for 4 distinct icon fields
const iconUploads = upload.fields([
  { name: "Icon1", maxCount: 1 },
  { name: "Icon2", maxCount: 1 },
  { name: "Icon3", maxCount: 1 },
  { name: "Icon4", maxCount: 1 },
]);

// Routes (No ID needed)
 WCUrouter.post("/",authenticate, iconUploads, createWhyChooseUs);
 WCUrouter.get("/", getWhyChooseUs);
 WCUrouter.patch("/",authenticate, iconUploads, updateWhyChooseUs);
 WCUrouter.delete("/",authenticate, deleteWhyChooseUs);

export default  WCUrouter;