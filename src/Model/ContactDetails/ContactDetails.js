// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const ContactDetailsSchema = new SCHEMA(
  {
  
    call:{
        type: String,
      required: true,
     
   },
    
    email:{
        type: String,
      required: true,
     
   },
 
    address:{
        type: String,
      required: true,
     
   },
  
    hours:{
        type: String,
      required: true,
   },

   
  },
  { timestamps: true }
);

export const ContactDetails = mongoose.model("ContactDetails", ContactDetailsSchema);
