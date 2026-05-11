import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Movie", "Travel", "Event", "Food", "Other"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      default: 0, // 0 means free / exchange
    },
    expiry: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    image: {
      type: String,
      default: "", // file path stored after upload
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "sold", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);