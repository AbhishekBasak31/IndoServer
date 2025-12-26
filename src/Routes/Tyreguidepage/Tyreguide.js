import express from "express";
import { 
  createTyreGuide, 
  getTyreGuide, 
  updateTyreGuide, 
  deleteTyreGuide 
} from "../../Controller/Tyreguidepage/Tyreguide.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";
const TyreGuideRouter = express.Router();

// Route: /api/v1/tyreguide

TyreGuideRouter.get("/", getTyreGuide);
TyreGuideRouter.post("/", authenticate, createTyreGuide);

// ✅ Updated: No ID required in URL
TyreGuideRouter.patch("/",authenticate, updateTyreGuide);
TyreGuideRouter.delete("/",authenticate, deleteTyreGuide);

export default TyreGuideRouter;