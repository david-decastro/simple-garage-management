export class CarSimpleDTO {
  constructor(car) {
    this._id = car._id;
    this.brand = car.brand;
    this.model = car.model;
  }

  static fromList(cars) {
    return cars.map((car) => new CarSimpleDTO(car));
  }
}
