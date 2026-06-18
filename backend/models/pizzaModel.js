import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide pizza name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide pizza description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide pizza price"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide pizza category"],
      enum: ["Veg", "Non-Veg", "Specialty"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide pizza image URL"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pizza", pizzaSchema);
