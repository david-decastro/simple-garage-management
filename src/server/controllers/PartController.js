import errorHandler from "./ErrorHandler.js";
import PartService from "../services/PartService.js";

const findAll = async function (req, res) {
  console.log(`Searching all parts`);
  try {
    const parts = await PartService.findAll(req.filters, req.pagination);
    return res.status(200).jsonp(parts);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const find = async function (req, res) {
  console.log(`Searching part with id: ${req.params.id}`);
  try {
    const part = await PartService.find(req.params.id);
    return res.status(200).jsonp(part);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const getImage = async function (req, res) {
  console.log(`Searching image for part with id: ${req.params.id}`);
  try {
    const imagePath = await PartService.getImage(req.params.id);
    return res.sendFile(imagePath);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const save = async function (req, res) {
  console.log("Creating a new part");
  try {
    const createdPart = await PartService.save(req.body);
    res.status(201).jsonp(createdPart);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const update = async function (req, res) {
  console.log(`Updating cart with id: ${req.params.id}`);
  try {
    const modPart = await PartService.update(req.params.id, req.body);
    res.status(201).jsonp(modPart);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const remove = async function (req, res) {
  console.log(`Removing part with id: ${req.params.id}`);
  try {
    await PartService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

export default {
  find,
  findAll,
  getImage,
  remove,
  save,
  update,
};
