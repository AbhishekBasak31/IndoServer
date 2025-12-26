import mongoose from "mongoose";
const { Schema } = mongoose;


const DirectorSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Img:{
          type: String,
      required: true,
    },
    Desig:{
          type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
);

export const Director = mongoose.model("Director", DirectorSchema);
