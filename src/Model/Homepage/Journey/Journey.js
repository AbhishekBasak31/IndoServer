import mongoose from "mongoose";
const { Schema } = mongoose;



// Main schema for company journey
const JourneySchema = new Schema(
  {
    year: {
      type: String,
      required: true,
  
    },
    event: {
      type: String,
      required: true,
    },
    Image:{
    type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Journey = mongoose.model("Journey", JourneySchema);
