export class CarDTO {
  constructor(car) {
    this._id = car._id;
    this.brand = car.brand;
    this.model = car.model;
    this.year = car.year;
    this.plate = car.plate;
    this.itvDate = car.itvDate
      ? new Date(car.itvDate).toISOString().split("T")[0]
      : "";
    this.fuel = car.fuel;
    this.image = car.image;
  }

  static fromList(cars) {
    return cars.map((car) => new CarDTO(car));
  }
}
