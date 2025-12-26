import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogCategorySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const BlogCategory = mongoose.model("BlogCategory", BlogCategorySchema);