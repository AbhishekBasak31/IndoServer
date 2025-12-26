import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Img: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    readtime: {
      type: String,
      required: true,
    }, // ✅ Fixed missing comma here
    
    // ✅ Updated Category Configuration
    Category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCategory", // Links to the schema above
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model("Blog", BlogSchema);