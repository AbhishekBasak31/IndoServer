import mongoose from "mongoose";
const { Schema } = mongoose;


const BrandSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    slug:{
        type: String,
      required: true,  
    },
    Img:{
          type: String,
      required: true,
    },
    Tyres:[{
          type: mongoose.Schema.Types.ObjectId,
             ref: "Tyre",
    }]
  },
  {
    timestamps: true
  }
);

export const Brand = mongoose.model("Brand", BrandSchema);
