import express from "express";
import { 
    createOurJourney, 
    getOurJourney, 
    updateOurJourney, 
    deleteOurJourney
} from "../../../Controller/HomePage/Ourjourney/OurJourney.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const OurJouneyrouter = express.Router();

// Route Base: /api/v1/home/trustedstory
OurJouneyrouter.post("/", authenticate,createOurJourney);
OurJouneyrouter.get("/", getOurJourney);

// No IDs required for these singleton operations
OurJouneyrouter.patch("/",authenticate, updateOurJourney);
OurJouneyrouter.delete("/",authenticate, deleteOurJourney);

export default OurJouneyrouter;