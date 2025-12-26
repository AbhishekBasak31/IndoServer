// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../../Utils/Constant.js";

const ReviewSchema = new SCHEMA(
  {
   Rating:{
        type: String,
      required: true,
     
   },
      Name:{
        type: String,
      required: true,
     
   },
     Comment:{
        type: String,
        required: true,
     
   },
  Location:{
        type: String,
        required: true,
     
   },
   active:{
    type:Boolean,
    default:true,
  
   },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", ReviewSchema);
export default Review;
