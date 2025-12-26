// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../../Utils/Constant.js";

const QuickLinkSchema = new SCHEMA(
  {
   Name:{
         type: String,
      required: true,
     
   },
    link:{
        type: String,
      required: true,
     
   },
    
  },
  { timestamps: true }
);

export const QuickLink = mongoose.model("QuickLink", QuickLinkSchema);
export default QuickLink;