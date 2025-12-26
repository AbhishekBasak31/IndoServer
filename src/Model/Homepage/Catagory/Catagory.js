import mongoose from "mongoose";
const { Schema } = mongoose;

const CatagorySchema = new Schema(
  {
    Htext: {
      type: String,
      required: true,
    },
    BgImg: {
      type: String,
      required: true,
    },

    Types:[ {
      type: mongoose.Schema.Types.ObjectId,
       ref: "VehicleType",
    }]
  },
  { timestamps: true }
);

export const Catagory = mongoose.model("Catagory", CatagorySchema);
