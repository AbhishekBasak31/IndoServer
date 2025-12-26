import express from "express";
import { upload } from "../../../Middlewares/Multer.js"; // Import your multer config
import { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} from "../../../Controller/Global/Blog/Blog.js";
import { authenticate } from "../../../Middlewares/AuthMiddleware.js";

const BlogRouter = express.Router();

// ✅ Use upload.fields for file handling
BlogRouter.post("/",authenticate, upload.single("Img"), createBlog);
BlogRouter.patch("/:id",authenticate, upload.single("Img"), updateBlog);

BlogRouter.get("/", getAllBlogs);
BlogRouter.get("/:id", getBlogById);
BlogRouter.delete("/:id",authenticate, deleteBlog);

export default BlogRouter;