export class InspectionPartDTO {
  constructor(inspectionPart) {
    this._id = inspectionPart._id;
    this.name = inspectionPart.part.name;
    this.barcode = inspectionPart.part.barcode;
    this.quantity = inspectionPart.quantity;
    this.price = inspectionPart.price;
    this.partId = inspectionPart.part._id;
    this.type = inspectionPart.part.type;
  }

  static fromList(inspectionParts) {
    return inspectionParts.map(
      (inspectionPart) => new InspectionPartDTO(inspectionPart)
    );
  }
}
