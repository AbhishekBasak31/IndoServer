import mongoose from "mongoose";
const { Schema } = mongoose;

const HeroSectionSchema = new Schema(
  {
    Htext: {
      type: String,
      required: true,
    },
    Dtext: {
      type: String,
      required: true,
    },
    Video1: {
      type: String,
      required: true,
    },
    Video2: {
      type: String,
      required: true,
    },
    Video3: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const HeroSection = mongoose.model("HeroSection", HeroSectionSchema);
