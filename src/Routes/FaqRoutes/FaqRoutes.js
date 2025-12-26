import express from "express";
import {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
  addCategory,
  addQuestion,
  deleteCategory
} from "../../Controller/FaqController/FaqController.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const FaqRouter = express.Router();

FaqRouter.route("/")
  .post(authenticate,createFaq)
  .get(getFaqs)
  .put(authenticate,updateFaq)
  .delete(authenticate,deleteFaq);

// Manage categories
FaqRouter.post("/category",authenticate, addCategory);
FaqRouter.delete("/category/:category",authenticate, deleteCategory);

// Manage questions inside a category
FaqRouter.post("/category/:category/question",authenticate, addQuestion);

export default FaqRouter;
