import mongoose from "mongoose";
const { Schema } = mongoose;

const DirectorSecSchema = new Schema(
  {
    MainHtext: {
      type: String,
      required: true,
    },
    MainDtext: {
      type: String,
      required: true,
    },

    Directors:[ {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Director",
    }]
  },
  { timestamps: true }
);

export const DirectorSec = mongoose.model("DirectorSec", DirectorSecSchema);
