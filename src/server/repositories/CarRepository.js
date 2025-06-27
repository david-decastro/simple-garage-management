import mongoose from "mongoose";
import { resultsPagination } from "../common/paginationUtils.js";
import { CarDTO } from "../services/dtos/CarDTO.js";
import Car from "../models/Car.js";

export async function findAll(filters, pagination = {}, dto = CarDTO) {
  let query = Car.find(filters);

  if (pagination.sort !== null) {
    query = query
      .collation({ locale: "en", strength: 2 })
      .sort(pagination.sort);
  }

  if (pagination.skip !== null && pagination.limit !== null) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const cars = await query.exec();

  // Returns the result directly if there is no pagination
  if (pagination.skip == null && pagination.limit == null) {
    return dto.fromList(cars);
  }

  // Returns the results and the pagination info
  const totalDocuments = await Car.countDocuments(filters);
  return {
    data: dto.fromList(cars),
    pagination: resultsPagination(pagination, totalDocuments),
  };
}

export async function findById(carId) {
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    return null;
  }
  const car = await Car.findOne({ _id: carId });
  return car ? new CarDTO(car) : null;
}

export async function create(car) {
  const newCar = await Car.create(car);
  return new CarDTO(newCar);
}

export async function update(carId, modCar) {
  const savedCar = await Car.findOneAndUpdate({ _id: carId }, modCar, {
    new: true,
    runValidators: true,
  });
  return new CarDTO(savedCar);
}

export async function remove(carId) {
  return Car.deleteOne({ _id: carId });
}

export default { create, findAll, findById, remove, update };
