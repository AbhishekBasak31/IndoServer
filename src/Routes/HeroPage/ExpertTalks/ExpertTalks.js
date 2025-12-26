import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createExpertTalks,
  getExpertTalks,
  updateExpertTalks,
  deleteExpertTalks,
} from "../../../Controller/HomePage/ExpertTalks/ExpertTalks.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const ExpertTalksrouter = express.Router();

// Define 'Video' as the expected file field name
const uploadVideo = upload.single("Video");

// Routes (Singleton pattern, no ID needed in URL)
ExpertTalksrouter.post("/",authenticate, uploadVideo, createExpertTalks);
ExpertTalksrouter.get("/", getExpertTalks);
ExpertTalksrouter.patch("/",authenticate, uploadVideo, updateExpertTalks);
ExpertTalksrouter.delete("/",authenticate, deleteExpertTalks);

export default ExpertTalksrouter;