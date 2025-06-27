export class InspectionCarTableDTO {
  constructor(inspection) {
    this.date = inspection.date
      ? new Date(inspection.date).toISOString().split("T")[0]
      : "";
    this.type = inspection.type;
    this.mileage = inspection.mileage;
    this.oilFilter = inspection.oilFilter;
    this.oilChanged = inspection.oilChanged;
    this.airFilter = inspection.airFilter;
    this.cabinAirFilter = inspection.cabinAirFilter;
    this.battery = inspection.battery;
    this.tyres = inspection.tyres;
  }

  static fromList(inspections) {
    return inspections.map(
      (inspection) => new InspectionCarTableDTO(inspection)
    );
  }
}
