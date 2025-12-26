import mongoose from "mongoose";
const { Schema } = mongoose;

const StoreLocatorSchema = new Schema(
  {
    MainHtext: {
      type: String,
      required: true,
    },
    BgImg: {
      type: String,
      required: true,
    },
    Counter1: {
      type: String,
      required: true,
    },
    Counter2: {
      type: String,
      required: true,
    },
    Counter1Text: {
      type: String,
      required: true,
    },
    Counter2Text: {
      type: String,
      required: true,
    },
    StoreLocators:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "StoreLocator",
       }]
  },
  { timestamps: true }
);

export const StoreLocatorSec = mongoose.model("StoreLocatorSec", StoreLocatorSchema);
