import { InspectionFormDTO } from "./dtos/InspectionFormDTO.js";
import { InspectionPartDTO } from "./dtos/InspectionPartDTO.js";

import { handleDbError } from "./errors/handleDbError.js";
import { NotFoundError } from "./errors/NotFoundError.js";
import { ValidationError } from "./errors/ValidationError.js";

import InspectionPartRepository from "../repositories/InspectionPartRepository.js";
import InspectionPart from "../models/InspectionPart.js";
import InspectionRepository from "../repositories/InspectionRepository.js";
import PartRepository from "../repositories/PartRepository.js";
import CarRepository from "../repositories/CarRepository.js";

const findAll = async function (reqFilters, pagination) {
  const filters = {};
  if (reqFilters.inspectionId) {
    const inspection = await InspectionRepository.findById(
      reqFilters.inspectionId
    );
    if (!inspection) {
      throw new NotFoundError(
        `Inspection with id '${reqFilters.inspectionId}' not found`
      );
    }
    filters.inspection = reqFilters.inspectionId;
  } else if (reqFilters.carId) {
    const car = await CarRepository.findById(reqFilters.carId);
    if (!car) {
      throw new NotFoundError(`Car with id '${reqFilters.carId}' not found`);
    }
    const carInspectionsIds = await InspectionRepository.findAll({
      car: reqFilters.carId,
    });
    filters.inspection = carInspectionsIds.map((i) => i._id);
  }
  const inspectionParts = await InspectionPartRepository.findAll(
    filters,
    pagination
  );
  return {
    data: InspectionPartDTO.fromList(inspectionParts.data),
    pagination: inspectionParts.pagination,
  };
};

const save = async (newInspectionPart) => {
  await _checkRequiredAttr(newInspectionPart);
  try {
    const existing = await InspectionPartRepository.findByInspectionIdAndPartId(
      newInspectionPart.inspection,
      newInspectionPart.part
    );

    let saved;
    if (existing) {
      existing.quantity += newInspectionPart.quantity;
      existing.price += newInspectionPart.price;
      saved = await InspectionPartRepository.update(existing._id, existing);
    } else {
      const newPart = new InspectionPart(newInspectionPart);
      saved = await InspectionPartRepository.create(newPart);
    }

    return new InspectionPartDTO(saved);
  } catch (error) {
    handleDbError(error);
  }
};

const update = async function (inspectionId, inspectionAttr) {
  const inspection = await InspectionPartRepository.findById(inspectionId);
  if (!inspection) {
    throw new NotFoundError(`Inspection with id '${inspectionId}' not found`);
  }
  try {
    // Preparing attributes to update
    delete inspectionAttr._id; // To prevent update the ID
    const updatedInspection = await InspectionPartRepository.update(
      inspectionId,
      inspectionAttr
    );
    return new InspectionFormDTO(updatedInspection);
  } catch (error) {
    handleDbError(error);
  }
};

const remove = async function (inspectionPartId) {
  const result = await InspectionPartRepository.remove(inspectionPartId);
  if (result.deletedCount === 0) {
    throw new NotFoundError(
      `Inspection part with id '${inspectionPartId}' not found`
    );
  }
};

const _checkRequiredAttr = async (inspectionPartAttr) => {
  if (!inspectionPartAttr.part) {
    throw new ValidationError("The 'part' field is required");
  } else {
    const part = await PartRepository.findById(inspectionPartAttr.part);
    if (!part) {
      throw new NotFoundError(
        `Part with id '${inspectionPartAttr.part}' not found`
      );
    }
  }
  if (!inspectionPartAttr.inspection) {
    throw new ValidationError("The 'inspection' field is required");
  } else {
    const inspection = await InspectionRepository.findById(
      inspectionPartAttr.inspection
    );
    if (!inspection) {
      throw new NotFoundError(
        `Inspection with id '${inspectionPartAttr.inspection}' not found`
      );
    }
  }
  if (!inspectionPartAttr.quantity) {
    throw new ValidationError("The 'quantity' field is required");
  }
};

export default {
  findAll,
  remove,
  save,
  update,
};
