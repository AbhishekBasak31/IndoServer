import express from "express";
import {
  createStoreLocator,
  getAllStoreLocators,
  updateStoreLocator,
  deleteStoreLocator,
  toggleStoreStatus,
} from "../../../Controller/Global/StoreLocator/StoreLocator.js"; // Adjust path
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const StoreLocatorrouter = express.Router();

StoreLocatorrouter.post("/",authenticate, createStoreLocator);
StoreLocatorrouter.get("/", getAllStoreLocators);
StoreLocatorrouter.patch("/:id",authenticate, updateStoreLocator);
StoreLocatorrouter.delete("/:id", authenticate,deleteStoreLocator);

// Utility route to quickly toggle active status
StoreLocatorrouter.patch("/:id/status", authenticate,toggleStoreStatus);

export default StoreLocatorrouter;