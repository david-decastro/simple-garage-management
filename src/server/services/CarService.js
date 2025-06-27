import Car from "../models/Car.js";
import { CarSimpleDTO } from "./dtos/CarSimpleDTO.js";
import CarRepository from "../repositories/CarRepository.js";

import { ValidationError } from "./errors/ValidationError.js";
import { NotFoundError } from "./errors/NotFoundError.js";
import FuelType from "../enums/FuelType.js";
import InspectionRepository from "../repositories/InspectionRepository.js";
import {
  deleteFolder,
  getCarsFolder,
  getFileAbsolutePath,
  persistFile,
} from "./FileService.js";
import { InspectionCarTableDTO } from "./dtos/InspectionCarTableDTO.js";
import { handleDbError } from "./errors/handleDbError.js";
import InspectionService from "./InspectionService.js";

const findAll = async function (pagination) {
  const cars = await CarRepository.findAll(null, pagination);
  const carsWithInspections = await Promise.all(
    cars.data.map(async (car) => {
      const [lastInspection, lastOilChange] = await Promise.all([
        InspectionRepository.findLastInspection({ car: car._id }),
        InspectionRepository.findLastInspection({
          car: car._id,
          oilChanged: true,
        }),
      ]);

      return {
        ...car,
        lastInspection: lastInspection
          ? new InspectionCarTableDTO(lastInspection)
          : null,
        lastOilChange: lastOilChange
          ? new InspectionCarTableDTO(lastOilChange)
          : null,
      };
    })
  );

  return {
    data: carsWithInspections,
    pagination: cars.pagination,
  };
};

const findAllBasic = async function (pagination) {
  return await CarRepository.findAll(null, pagination, CarSimpleDTO);
};

const find = async function (carId) {
  const car = await CarRepository.findById(carId);
  if (!car) {
    throw new NotFoundError(`Car with id '${carId}' not found`);
  }
  const lastInspection = await InspectionRepository.findLastInspection({
    car: car._id,
    oilChanged: true,
  });
  car.mileage = lastInspection ? lastInspection.mileage : 0;
  if (!car) {
    throw new NotFoundError(`Car with id '${carId}' not found`);
  }
  return car;
};

const getImage = async function (carId) {
  const car = await CarRepository.findById(carId);
  if (!car) {
    throw new NotFoundError(`Car with id '${carId}' not found`);
  }

  if (!car.image) {
    throw new NotFoundError(`Image not found for car with id '${carId}'`);
  }

  return await getFileAbsolutePath(car.image);
};

const save = async function (carAttr) {
  _checkRequiredAttr(carAttr); // Throw an exception if one field is not completed
  const car = new Car(carAttr);
  try {
    const imageName = _manageCarImg(carAttr);
    if (imageName) {
      car.image = imageName;
    }
    // Convert plate to uppercase
    car.plate = car.plate.toUpperCase();
    return await CarRepository.create(car);
  } catch (error) {
    handleDbError(error);
  }
};

const update = async function (carId, carAttr) {
  const car = await CarRepository.findById(carId);
  if (!car) {
    throw new NotFoundError(`Car with id '${carId}' not found`);
  }
  try {
    // Preparing attributes to update
    delete carAttr._id;
    const imageName = _manageCarImg(carAttr);
    if (imageName) {
      carAttr.image = imageName;
    }
    // Convert plate to uppercase
    carAttr.plate = carAttr.plate.toUpperCase();
    return await CarRepository.update(carId, carAttr);
  } catch (error) {
    handleDbError(error);
  }
};

const remove = async function (carId) {
  const car = await CarRepository.findById(carId);
  if (!car) {
    throw NotFoundError(`Car with id '${carId}' not found`);
  }

  // We check first if the car exists
  const result = await CarRepository.remove(carId);
  if (result.deletedCount === 0) {
    throw new NotFoundError(`Car with id '${carId}' not found`);
  }

  // Deleting associated files
  await deleteFolder(`${getCarsFolder()}/${car.plate}/`);

  // Deleting associated inspections
  const inspections = await InspectionRepository.findByCarId(carId);
  console.log(inspections.length);
  for (const inspection of inspections) {
    await InspectionService.remove(inspection._id);
  }
};

const _checkRequiredAttr = (carAttr) => {
  if (!carAttr.brand) {
    throw new ValidationError("The 'brand' field is required");
  }
  if (!carAttr.model) {
    throw new ValidationError("The 'model' field is required");
  }
  if (carAttr.fuel && !Object.values(FuelType).includes(carAttr.fuel)) {
    throw new ValidationError(`Fuel type '${carAttr.fuel}' is not valid`);
  }
};

const _manageCarImg = (carAttr) => {
  if (carAttr.image && carAttr.image.startsWith("temp-")) {
    return persistFile(
      `${getCarsFolder()}/${carAttr.plate}/`,
      carAttr.image,
      "main"
    );
  }
};

export default {
  find,
  findAll,
  findAllBasic,
  getImage,
  remove,
  save,
  update,
};
