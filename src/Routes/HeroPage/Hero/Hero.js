import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createHero,
  getHero,
  updateHero,
  deleteHero,
} from "../../../Controller/HomePage/Hero/Hero.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const HomeHerorouter = express.Router();

// Define file fields configuration
const videoUploads = upload.fields([
  { name: "Video1", maxCount: 1 },
  { name: "Video2", maxCount: 1 },
  { name: "Video3", maxCount: 1 },
]);

HomeHerorouter.post("/",authenticate, videoUploads, createHero);
HomeHerorouter.get("/", getHero);
HomeHerorouter.patch("/",authenticate, videoUploads, updateHero);
HomeHerorouter.delete("/",authenticate, deleteHero);

export default HomeHerorouter;