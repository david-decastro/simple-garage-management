import mongoose from "mongoose";
import FuelType from "../enums/FuelType.js";
import OilViscosityGrade from "../enums/OilViscosityGrade.js";

const Car = mongoose.model("Car", {
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  plate: { type: String, required: true, unique: true },
  fuel: {
    type: String,
    required: true,
    enum: Object.values(FuelType),
  },
  oilViscosities: {
    type: [String],
    enum: Object.values(OilViscosityGrade),
    required: false,
  },
  itvDate: {
    type: Date,
    required: false,
  },
  image: { type: String, required: false },
});

export default Car;
