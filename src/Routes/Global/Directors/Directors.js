import express from "express";
import { upload } from "../../../Middlewares/Multer.js";
import { 
  createDirector, 
  getAllDirectors, 
  updateDirector, 
  deleteDirector 
} from "../../../Controller/Global/Directors/Directors.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Directorrouter = express.Router();

// Route Base: /api/v1/about/director

Directorrouter.post("/", authenticate, upload.single("Img"), createDirector);
Directorrouter.get("/", getAllDirectors);
Directorrouter.patch("/:id", authenticate, upload.single("Img"), updateDirector);
Directorrouter.delete("/:id",authenticate, deleteDirector);

export default Directorrouter;