import InspectionService from "../services/InspectionService.js";
import InspectionPartService from "../services/InspectionPartService.js";

import errorHandler from "../controllers/ErrorHandler.js";

const findAll = async function (req, res) {
  console.log(`Searching all inspections`);
  try {
    const filters = req.query.car ? { car: req.query.car } : {};
    const results = await InspectionService.findAll(filters, req.pagination);
    return res.status(200).jsonp(results);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const find = async function (req, res) {
  console.log(`Searching inspection with id: ${req.params.id}`);
  try {
    const inspection = await InspectionService.findById(req.params.id);
    return res.status(200).jsonp(inspection);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const findParts = async function (req, res) {
  console.log(`Searching parts for inspection with id: ${req.params.id}`);
  try {
    const inspectionParts = await InspectionPartService.findAll(
      { inspectionId: req.params.id },
      req.pagination
    );
    return res.status(200).jsonp(inspectionParts);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const getInvoice = async function (req, res) {
  console.log(`Getting invoice for inspection with id: ${req.params.id}`);
  try {
    const invoice = await InspectionService.getInvoice(req.params.id);
    return res.status(200).sendFile(invoice);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const save = async function (req, res) {
  console.log("Creating a new inspection");
  try {
    const createdInspection = await InspectionService.save(req.body);
    res.status(201).jsonp(createdInspection);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const update = async function (req, res) {
  console.log(`Updating inspection with id: ${req.params.id}`);
  try {
    const modCar = await InspectionService.update(req.params.id, req.body);
    res.status(201).jsonp(modCar);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const remove = async function (req, res) {
  console.log(`Removing inspection with id: ${req.params.id}`);
  try {
    await InspectionService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

export default {
  find,
  findAll,
  findParts,
  getInvoice,
  remove,
  save,
  update,
};
