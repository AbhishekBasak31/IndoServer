import mongoose from "mongoose";
const { Schema } = mongoose;

const ExpertTalksSchema = new Schema(
  {
    Htext: {
      type: String,
      required: true,
    },
    Dtext: {
      type: String,
      required: true,
    },
    Dtext2: {
      type: String,
      required: true,
    },
    youVideoLink:{
     type: String,
      required: true,
    },
    Video: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ExpertTalks = mongoose.model("ExpertTalks",ExpertTalksSchema);
