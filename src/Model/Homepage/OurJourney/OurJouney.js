import mongoose from "mongoose";
const { Schema } = mongoose;

const OurjourneySchema = new Schema({
  Htext: { type: String, required: true },
  Dtext: { type: String, required: true, },
}, { timestamps: true });


export const Ourjourney = mongoose.model("Ourjourney", OurjourneySchema);
