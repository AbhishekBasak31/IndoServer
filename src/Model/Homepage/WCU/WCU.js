import mongoose from "mongoose";
const { Schema } = mongoose;

const WhychooseusSchema = new Schema(
   
  {
     MainHtext:{
        type: String,
      required: true,
     },
    Icon1: {
      type: String,
      required: true,
    },
    Htext1: {
      type: String,
      required: true,
    },
    Dtext1: {
      type: String,
      required: true,
    },
    Icon2: {
      type: String,
      required: true,
    },
    Htext2: {
      type: String,
      required: true,
    },
    Dtext2: {
      type: String,
      required: true,
    },

    Icon3: {
      type: String,
      required: true,
    },
    Htext3: {
      type: String,
      required: true,
    },
    Dtext3: {
      type: String,
      required: true,
    },

    Icon4: {
      type: String,
      required: true,
    },
    Htext4: {
      type: String,
      required: true,
    },
    Dtext4: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Whychooseus = mongoose.model("whychooseus", WhychooseusSchema);
