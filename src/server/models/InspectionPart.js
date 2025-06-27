import mongoose from "mongoose";

const InspectionPart = mongoose.model("InspectionPart", {
  part: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Part",
    required: true,
  },
  inspection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inspection",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number },
  shop: { type: String },
  invoice: { type: String },
});

export default InspectionPart;
