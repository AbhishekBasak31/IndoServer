import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createStoreLocatorSec,
  getStoreLocatorSec,
  updateStoreLocatorSec,
  deleteStoreLocatorSec,
} from "../../../Controller/HomePage/StoreLocatorsec/StoreLocatorSec.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const StoreLocatorsecrouter = express.Router();

// Define 'BgImg' as the expected file field name
const uploadBg = upload.single("BgImg");

// Routes (Singleton pattern)
StoreLocatorsecrouter.post("/",authenticate, uploadBg, createStoreLocatorSec);
StoreLocatorsecrouter.get("/", getStoreLocatorSec);
StoreLocatorsecrouter.patch("/",authenticate, uploadBg, updateStoreLocatorSec);
StoreLocatorsecrouter.delete("/",authenticate, deleteStoreLocatorSec);

export default StoreLocatorsecrouter ;