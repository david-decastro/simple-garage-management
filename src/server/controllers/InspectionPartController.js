import InspectionPartService from "../services/InspectionPartService.js";

import errorHandler from "../controllers/ErrorHandler.js";

const findAll = async function (req, res) {
  console.log(`Searching all inspection parts`);
  try {
    const filters = req.query.carId ? { carId: req.query.carId } : {};
    const results = await InspectionPartService.findAll(
      filters,
      req.pagination
    );
    return res.status(200).jsonp(results);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const save = async function (req, res) {
  console.log("Creating a new inspection part");
  try {
    const createdInspectionPart = await InspectionPartService.save(req.body);
    res.status(201).jsonp(createdInspectionPart);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const update = async function (req, res) {
  console.log(`Updating inspection part with id: ${req.params.id}`);
  try {
    const modPart = await InspectionPartService.update(req.params.id, req.body);
    res.status(201).jsonp(modPart);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const remove = async function (req, res) {
  console.log(`Removing inspection part with id: ${req.params.id}`);
  try {
    await InspectionPartService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

export default {
  findAll,
  remove,
  save,
  update,
};
