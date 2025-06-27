import { FaCarBattery, FaOilCan, FaFilter } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";

export const maintenanceConfig = {
  oilChanged: {
    icon: FaOilCan,
    color: "text-blue-600",
    field: "oilChanged",
    translationKey: "inspections.fields.oil-changed",
  },
  oilFilter: {
    icon: FaFilter,
    color: "text-yellow-600",
    field: "oilFilter",
    translationKey: "inspections.fields.oil-filter",
  },
  airFilter: {
    icon: FaFilter,
    color: "text-green-600",
    field: "airFilter",
    translationKey: "inspections.fields.air-filter",
  },
  cabinAirFilter: {
    icon: FaFilter,
    color: "text-purple-600",
    field: "cabinAirFilter",
    translationKey: "inspections.fields.air-cabin-filter",
  },
  battery: {
    icon: FaCarBattery,
    color: "text-red-600",
    field: "battery",
    translationKey: "inspections.fields.battery",
  },
  tyres: {
    icon: GiCarWheel,
    color: "text-black",
    field: "tyres",
    translationKey: "inspections.fields.tyres",
  },
};
