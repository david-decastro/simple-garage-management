import mongoose from "mongoose";
import PartType from "../enums/PartType.js";
import OilViscosityGrade from "../enums/OilViscosityGrade.js";

const Part = mongoose.model("Part", {
  name: { type: String, required: true },
  barcode: { type: String }, // Not required, oils doesn't have
  price: { type: Number, required: false },
  image: { type: String, required: false },
  type: {
    type: String,
    enum: Object.values(PartType),
    required: true,
  },
  oilViscosity: {
    type: String,
    enum: Object.values(OilViscosityGrade),
  },
});

export default Part;
