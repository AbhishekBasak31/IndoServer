import express from "express";
import { upload } from "../../Middlewares/Multer.js";
import {
  createFooter,
  getAllFooters,
  updateFooter,
  deleteFooter,
} from "../../Controller/FooterController/FooterController.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Uploading a single file for 'logo'
router.post("/",authenticate, upload.single("logo"), createFooter);
router.get("/", getAllFooters);
router.patch("/:id",authenticate, upload.single("logo"), updateFooter);
router.delete("/:id",authenticate, deleteFooter);

export default router;