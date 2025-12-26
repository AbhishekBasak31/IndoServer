import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createAddon,
  getAddon,
  updateAddon,
  deleteAddon,
} from "../../../Controller/HomePage/Addons/Addons.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Haddonrouter = express.Router();

// Define Upload Fields for 4 Cards
const iconUploads = upload.fields([
  { name: "Card1Icon", maxCount: 1 },
  { name: "Card2Icon", maxCount: 1 },
  { name: "Card3Icon", maxCount: 1 },
  { name: "Card4Icon", maxCount: 1 },
]);

Haddonrouter.post("/",authenticate, iconUploads, createAddon);
Haddonrouter.get("/", getAddon);
Haddonrouter.patch("/",authenticate, iconUploads, updateAddon);
Haddonrouter.delete("/",authenticate, deleteAddon);

export default Haddonrouter;