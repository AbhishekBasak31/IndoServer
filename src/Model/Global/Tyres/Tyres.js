import mongoose from "mongoose";
const { Schema } = mongoose;

const TyreSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true }, // Added unique
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    vehicleTypes: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleType" },
    
    // ✅ Updated Tech Spec
    techspec: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        _id: false // Prevents creating IDs for every spec row
      }
    ],

    // ✅ Updated Compatibility
    compatibility: [
      {
        vehiclebrand: { type: String, required: true },
        vehicles: [{ type: String, required: true }], // Array of strings
        _id: false
      }
    ],

    price: { type: String, required: true },
    oldPrice: { type: String, required: true },
    discount: { type: String, default: null },
    rating: { type: String, required: true },
    dealer: { type: mongoose.Schema.Types.ObjectId, ref: "StoreLocator" },
    stock: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
    description: { type: String, required: true },

    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },
    image5: { type: String, required: true },
  },
  { timestamps: true }
);

export const Tyre = mongoose.model("Tyre", TyreSchema);