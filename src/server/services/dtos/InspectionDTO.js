import { CarSimpleDTO } from "./CarSimpleDTO.js";

export class InspectionDTO {
  constructor(inspection) {
    this._id = inspection._id;
    this.car = new CarSimpleDTO(inspection.car);
    this.date = inspection.date
      ? new Date(inspection.date).toISOString().split("T")[0]
      : "";
    this.type = inspection.type;
    this.status = inspection.status;
    this.paymentStatus = inspection.paymentStatus;
    this.location = inspection.location;
    this.mileage = inspection.mileage;
    this.notes = inspection.notes;
    this.oilFilter = inspection.oilFilter;
    this.oilChanged = inspection.oilChanged;
    this.airFilter = inspection.airFilter;
    this.cabinAirFilter = inspection.cabinAirFilter;
    this.battery = inspection.battery;
    this.tyres = inspection.tyres;
    this.mechanic = inspection.mechanic;
  }

  static fromList(inspections) {
    return inspections.map((inspection) => new InspectionDTO(inspection));
  }
}
