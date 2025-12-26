import express from "express";
import { 
    createDirectorSec, 
    getDirectorSec, 
    updateDirectorSec,
    deleteDirectorSec
} from "../../../Controller/HomePage/DirectorSec/DirectoSec.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const DirectorSecrouter = express.Router();

// Route Base: /api/v1/about/directorsec

// Create
DirectorSecrouter.post("/",authenticate, createDirectorSec);

// Read
DirectorSecrouter.get("/", getDirectorSec);

// Update (Requires ID)
DirectorSecrouter.patch("/:id",authenticate, updateDirectorSec);

// Delete (Requires ID)
DirectorSecrouter.delete("/:id",authenticate, deleteDirectorSec);

export default DirectorSecrouter;