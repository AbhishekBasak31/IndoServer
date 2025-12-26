import mongoose from "mongoose";
const { Schema } = mongoose;


// Main vehicle schema containing categories
const TyreGuideSchema = new Schema(
  {
    MainHtext1: {
      type: String,
      require:true
    },
    MainDtext: {
      type: String,
      require:true
    },
    MainHtext2: {
      type: String,
      require:true
    },
    CardHtext1:{
      type: String,
      require:true
    },
    CardDtext1:{
      type: String,
      require:true
    },
    CardHtext2:{
      type: String,
      require:true
    },
    CardDtext2:{
      type: String,
      require:true
    },
    CardHtext3:{
      type: String,
      require:true
    },
    CardDtext3:{
      type: String,
      require:true
    },
    CardHtext4:{
      type: String,
      require:true
    },
    CardDtext4:{
      type: String,
      require:true
    },
    CardHtext5:{
      type: String,
      require:true
    },
    CardDtext5:{
      type: String,
      require:true
    },
    CardHtext6:{
      type: String,
      require:true
    },
    CardDtext6:{
      type: String,
      require:true
    },
    MainHtext3: {
      type: String,
      require:true
    },
    MainDtext1: {
      type: String,
      require:true
    },
    TableHtext1:{
          type: String,
      require:true  
    },
    TableHtext2:{
          type: String,
      require:true  
    },
    TableHtext3:{
          type: String,
      require:true  
    },
    row: [
      {
        col1: { 
          type: String, 
          required: true 
        },
        col2: { 
          type: String, 
          required: true 
        },
        col3: { 
          type: String, 
          required: true 
        },
        // Optional: Disable _id for rows if you don't need to query individual rows by ID
        _id: false 
      }
    ]
  },
  { timestamps: true }
);

export const TyreGuide = mongoose.model("TyreGuide", TyreGuideSchema);
