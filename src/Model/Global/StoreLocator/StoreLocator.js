// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../../Utils/Constant.js";

const StoreLocatorSchema = new SCHEMA(
  {
   StoreAddress:{
      type: String,
      required: true,
   },
   Workhour:{
     type: String,
      required: true,
   },
   Active:{
     type: Boolean,
      required: true,
      default:true
   },
    State:{
        type: String,
      required: true,
     
   },
   MapLink:{
      type: String,
      required: true,
   },
   PIncode:{
      type: String,
      required: true,
   },
   Phone1:{
      type: String,
      required: true,
   },
    Phone2:{
      type: String,
      required: false,
   },
    
  },
  { timestamps: true }
);

export const StoreLocator = mongoose.model("StoreLocator", StoreLocatorSchema);
export default StoreLocator;
