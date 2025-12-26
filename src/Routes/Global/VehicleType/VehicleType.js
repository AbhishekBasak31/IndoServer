import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Adjust path
import {
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
  getVehicleType,
  getAllVehicleTypes,
} from "../../../Controller/Global/VehicleType/VehicleType.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const VehicleTyperouter = express.Router();

// 'Icon' is the field name for the image file
VehicleTyperouter.post("/",authenticate, upload.single("Icon"), createVehicleType);
VehicleTyperouter.get("/", getAllVehicleTypes);
VehicleTyperouter.get("/:id", getVehicleType);
VehicleTyperouter.patch("/:id",authenticate, upload.single("Icon"), updateVehicleType);
VehicleTyperouter.delete("/:id",authenticate, deleteVehicleType);

export default VehicleTyperouter;