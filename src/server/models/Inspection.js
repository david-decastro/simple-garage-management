import mongoose from "mongoose";
import InspectionType from "../enums/InspectionType.js";
import InspectionLocation from "../enums/InspectionLocation.js";
import InspectionStatus from "../enums/InspectionStatus.js";
import InspectionPaymentStatus from "../enums/InspectionPaymentStatus.js";

const Inspection = mongoose.model("Inspection", {
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: Object.values(InspectionType),
    required: true,
    default: InspectionType.MAINTENANCE,
  },
  status: {
    type: String,
    enum: Object.values(InspectionStatus),
    required: true,
    default: InspectionStatus.PENDING,
  },
  location: {
    type: String,
    enum: Object.values(InspectionLocation),
    required: true,
    default: InspectionType.HOME,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(InspectionPaymentStatus),
    required: true,
    default: InspectionPaymentStatus.NOT_PAID,
  },
  mileage: { type: Number, required: true },
  notes: { type: String },
  oilFilter: { type: Boolean, default: false },
  oilChanged: { type: Boolean, default: false },
  airFilter: { type: Boolean, default: false },
  cabinAirFilter: { type: Boolean, default: false },
  battery: { type: Boolean, default: false },
  tyres: { type: Boolean, default: false },
  mechanic: { type: String },
  laborPrice: { type: Number },
  invoice: { type: String },
});

export default Inspection;
