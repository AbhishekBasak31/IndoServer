import express from "express";
import {
  createReviewSection,
  getReviewSection,
  updateReviewSection,
  deleteReviewSection,
} from "../../../Controller/HomePage/Reviewsec/Reviewsec.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Reviewsecrouter = express.Router();

// No ID needed as it is a singleton document
Reviewsecrouter.post("/",authenticate, createReviewSection);
Reviewsecrouter.get("/", getReviewSection);
Reviewsecrouter.patch("/",authenticate, updateReviewSection);
Reviewsecrouter.delete("/",authenticate, deleteReviewSection);

export default Reviewsecrouter;