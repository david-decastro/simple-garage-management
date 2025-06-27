import errorHandler from "./ErrorHandler.js";
import CarService from "../services/CarService.js";

const findAll = async function (req, res) {
  console.log(`Searching all cars`);
  try {
    const cars = await CarService.findAll(req.pagination);
    return res.status(200).jsonp(cars);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const findAllBasic = async function (req, res) {
  console.log(`Searching all cars getting basic info`);
  try {
    const cars = await CarService.findAllBasic(req.pagination);
    return res.status(200).jsonp(cars);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const find = async function (req, res) {
  console.log(`Searching car with id: ${req.params.id}`);
  try {
    const car = await CarService.find(req.params.id);
    return res.status(200).jsonp(car);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const getImage = async function (req, res) {
  console.log(`Searching image for car with id: ${req.params.id}`);
  try {
    const imagePath = await CarService.getImage(req.params.id);
    return res.sendFile(imagePath);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const save = async function (req, res) {
  console.log("Creating a new car");
  try {
    const createdCar = await CarService.save(req.body);
    res.status(201).jsonp(createdCar);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const update = async function (req, res) {
  console.log(`Updating car with id: ${req.params.id}`);
  try {
    const modCar = await CarService.update(req.params.id, req.body);
    res.status(201).jsonp(modCar);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const remove = async function (req, res) {
  console.log(`Removing car with id: ${req.params.id}`);
  try {
    await CarService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
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
