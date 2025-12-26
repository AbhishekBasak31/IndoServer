import mongoose from "mongoose";
import { SCHEMA } from "../../../Utils/Constant.js";

// Main Footer schema
const FooterSchema = new SCHEMA(
  {
    logo: {
      type: String,
      required: true
    },
    copyright:{
      type: String,
      required: true,
     
   }, 
   Dtext:{
      type: String,
      required: true,
   },
   socials:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "Social",
     
   }],
   quickLinks:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "QuickLink",
   }]
  },
  { timestamps: true }
);

export const Footer = mongoose.model("Footer", FooterSchema);
