import express from "express";
import {
  createReview,
  getAllReviews,
  deleteReview,
  toggleReviewStatus,
} from "../../../Controller/Global/Review/Review.js"; // Adjust path
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const Reviewrouter = express.Router();

Reviewrouter.post("/",authenticate, createReview);
Reviewrouter.get("/", getAllReviews);
Reviewrouter.delete("/:id",authenticate, deleteReview);

// Specific route to toggle visibility (useful for admin dashboard)
Reviewrouter.patch("/:id/status",authenticate, toggleReviewStatus);

export default Reviewrouter;