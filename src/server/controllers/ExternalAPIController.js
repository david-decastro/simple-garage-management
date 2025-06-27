import errorHandler from "./ErrorHandler.js";
import ExternalAPIService from "../services/ExternalAPIService.js";

const findAllBrands = async function (req, res) {
  console.log(`Searching all brands`);
  try {
    const cars = await ExternalAPIService.findAllBrands();
    return res.status(200).jsonp(cars);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

const findAllModels = async function (req, res) {
  console.log(`Searching models for brand: ${req.params.brand}`);
  try {
    const models = await ExternalAPIService.findAllModels(req.params.brand);
    return res.status(200).jsonp(models);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(message);
  }
};

export default {
  findAllBrands,
  findAllModels,
};
