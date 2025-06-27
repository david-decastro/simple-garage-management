export class PartDTO {
  constructor(part) {
    this._id = part._id;
    this.name = part.name;
    this.barcode = part.barcode;
    this.image = part.image;
    this.type = part.type;
    this.oilViscosity = part.oilViscosity;
  }

  static fromList(parts) {
    return parts.map((part) => new PartDTO(part));
  }
}
