import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Standard multer middleware
import { 
    createJourney, 
    getAllJourneys, 
    updateJourney, 
    deleteJourney 
} from "../../../Controller/HomePage/JourneyController/JourneyController.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Journeyrouter = express.Router();

// Route Base: /api/v1/home/journey

// Create (Image Required)
Journeyrouter.post("/",authenticate, upload.single("Image"), createJourney);

// Get All
Journeyrouter.get("/", getAllJourneys);

// Update (Image Optional)
Journeyrouter.patch("/:id",authenticate, upload.single("Image"), updateJourney);

// Delete
Journeyrouter.delete("/:id",authenticate, deleteJourney);

export default Journeyrouter;