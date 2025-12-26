// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../../Utils/Constant.js";

const ReviewSectionSchema = new SCHEMA(
  {
   Htext:{
      type: String,
      required: true,
   },
   Reviews:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
   }]
  },
  { timestamps: true }
);

export const ReviewSection = mongoose.model("ReviewSection", ReviewSectionSchema);
export default ReviewSection;
