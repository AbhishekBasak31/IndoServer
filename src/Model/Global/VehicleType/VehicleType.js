import mongoose from "mongoose";
const { Schema } = mongoose;

const VehicleTypeSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Icon: {
      type: String,
      required: true,
    },
    slug:{
        type: String,
      required: true,    
    },
    Tyres:[{
          type: mongoose.Schema.Types.ObjectId,
             ref: "Tyre",
    }]

  },
  { timestamps: true }
);

export const VehicleType = mongoose.model("VehicleType", VehicleTypeSchema);
