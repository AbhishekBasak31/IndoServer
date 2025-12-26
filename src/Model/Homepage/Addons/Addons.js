import mongoose from "mongoose";
const { Schema } = mongoose;

const AddonSchema = new Schema(
  {
    MainHtext: {
      type: String,
      required: true,
    },
    Card1Icon: {
      type: String,
      required: true,
    },

    Card1Htext:{
       type: String,
      required: true,
    },
    Card1Dtext:{
       type: String,
      required: true,
    },
    Card2Icon: {
      type: String,
      required: true,
    },

    Card2Htext:{
       type: String,
      required: true,
    },
    Card2Dtext:{
       type: String,
      required: true,
    },
    Card3Icon: {
      type: String,
      required: true,
    },

    Card3Htext:{
       type: String,
      required: true,
    },
    Card3Dtext:{
       type: String,
      required: true,
    },
    Card4Icon: {
      type: String,
      required: true,
    },

    Card4Htext:{
       type: String,
      required: true,
    },
    Card4Dtext:{
       type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Addon = mongoose.model("Addon", AddonSchema);
