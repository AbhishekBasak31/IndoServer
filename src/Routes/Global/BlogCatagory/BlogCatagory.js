import express from "express";
import { createCategory, getAllCategories, deleteCategory } from "../../../Controller/Global/BlogCatagory/BlogCatagory.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const BlogCategoryRouter = express.Router();

BlogCategoryRouter.post("/",authenticate, createCategory);
BlogCategoryRouter.get("/", getAllCategories);
BlogCategoryRouter.delete("/:id",authenticate, deleteCategory);

export default BlogCategoryRouter;