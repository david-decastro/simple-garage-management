import Inspection from "../models/Inspection.js";
import InspectionLocation from "../enums/InspectionLocation.js";
import InspectionStatus from "../enums/InspectionStatus.js";
import InspectionType from "../enums/InspectionType.js";
import InspectionPaymentStatus from "../enums/InspectionPaymentStatus.js";
import { InspectionDTO } from "./dtos/InspectionDTO.js";
import { InspectionFormDTO } from "./dtos/InspectionFormDTO.js";

import { handleDbError } from "./errors/handleDbError.js";
import { NotFoundError } from "./errors/NotFoundError.js";
import { ValidationError } from "./errors/ValidationError.js";

import InspectionRepository from "../repositories/InspectionRepository.js";
import CarRepository from "../repositories/CarRepository.js";
import InspectionPartService from "./InspectionPartService.js";
import InspectionPartRepository from "../repositories/InspectionPartRepository.js";
import {
  deleteFile,
  deleteFolder,
  getCarsFolder,
  getFileAbsolutePath,
  persistFile,
} from "./FileService.js";

const findAll = async function (filters, pagination) {
  const inspections = await InspectionRepository.findAll(filters, pagination);
  if (inspections.data) {
    return {
      data: InspectionDTO.fromList(inspections.data),
      pagination: inspections.pagination,
    };
  } else {
    return InspectionDTO.fromList(inspections);
  }
};

const findById = async function (inspectionId) {
  const inspection = await InspectionRepository.findById(inspectionId);
  if (!inspection) {
    throw new NotFoundError(`Inspection with id '${inspectionId}' not found`);
  } else {
    const inspectionParts = await InspectionPartRepository.findAll({
      inspection: inspectionId,
    });
    const partsPrice = inspectionParts.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    return new InspectionFormDTO(inspection, partsPrice);
  }
};

const findParts = async function (inspectionId, pagination) {
  return await InspectionPartService.findAll(
    { inspection: inspectionId },
    pagination
  );
};

const getInvoice = async function (inspectionId) {
  const inspection = await InspectionRepository.findById(inspectionId);
  if (!inspection) {
    throw new NotFoundError(`Inspection with id '${inspectionId}' not found`);
  }
  if (!inspection.invoice) {
    throw new NotFoundError(
      `Inspection with id '${inspectionId}' doesn't have a attached invoice`
    );
  }
  return getFileAbsolutePath(inspection.invoice);
};

const save = async function (inspectionToCreate) {
  _checkRequiredAttr(inspectionToCreate);
  const inspection = new Inspection(inspectionToCreate);
  try {
    let savedInspection = await InspectionRepository.create(inspection);
    if (inspectionToCreate.invoice) {
      const invoicePath = await _manageInvoice(
        inspectionToCreate,
        savedInspection
      );
      if (invoicePath) {
        savedInspection.invoice = invoicePath;
        savedInspection = await InspectionRepository.update(
          savedInspection._id,
          savedInspection
        );
      }
    }
    return new InspectionFormDTO(savedInspection);
  } catch (error) {
    handleDbError(error);
  }
};

const update = async function (inspectionId, inspectionAttr) {
  const inspection = await InspectionRepository.findById(inspectionId);
  if (!inspection) {
    throw new NotFoundError(`Inspection with id '${inspectionId}' not found`);
  }
  try {
    // Preparing attributes to update
    delete inspectionAttr._id; // To prevent update the ID
    if (inspectionAttr.invoice || inspection.invoice) {
      inspectionAttr.invoice = await _manageInvoice(inspectionAttr, inspection);
    }
    const updatedInspection = await InspectionRepository.update(
      inspectionId,
      inspectionAttr
    );
    return new InspectionFormDTO(updatedInspection);
  } catch (error) {
    handleDbError(error);
  }
};

const remove = async function (inspectionId) {
  const inspection = await InspectionRepository.findById(inspectionId);

  if (!inspection) {
    throw new NotFoundError(`Inspection with id '${inspectionId}' not found`);
  }
  const result = await InspectionRepository.remove(inspectionId);
  if (result.deletedCount === 0) {
    throw new NotFoundError(`Inspection with id '${inspectionId}' not found`);
  }

  // Remove all associated InspectionParts
  await InspectionPartRepository.removeByInspectionId(inspectionId);

  // Remove all files
  const car = await CarRepository.findById(inspection.car);
  await deleteFolder(_getFilesPath(inspection, car));
};

const _checkRequiredAttr = (inspectionAttr) => {
  if (!inspectionAttr.car) {
    throw new ValidationError("The 'car' field is required");
  } else {
    const car = CarRepository.findById(inspectionAttr.car);
    if (!car) {
      throw new ValidationError(
        `The car with id '${inspectionAttr.car}' not found`
      );
    }
  }
  if (!inspectionAttr.date) {
    throw new ValidationError("The 'date' field is required");
  }
  if (!inspectionAttr.mileage) {
    throw new ValidationError("The 'mileage' field is required");
  }
  if (
    !inspectionAttr.type ||
    !Object.values(InspectionType).includes(inspectionAttr.type)
  ) {
    throw new ValidationError(
      `The inspection type '${inspectionAttr.type}' is not valid`
    );
  }
  if (
    !inspectionAttr.status ||
    !Object.values(InspectionStatus).includes(inspectionAttr.status)
  ) {
    throw new ValidationError(
      `The status '${inspectionAttr.status}' is not valid`
    );
  }
  if (
    !inspectionAttr.paymentStatus ||
    !Object.values(InspectionPaymentStatus).includes(
      inspectionAttr.paymentStatus
    )
  ) {
    throw new ValidationError(
      `The status '${inspectionAttr.paymentStatus}' is not valid`
    );
  }
  if (
    !inspectionAttr.location ||
    !Object.values(InspectionLocation).includes(inspectionAttr.location)
  ) {
    throw new ValidationError(
      `The location '${inspectionAttr.location}' is not valid`
    );
  }
};

const _getFilesPath = (inspection, car) => {
  return `${getCarsFolder()}/${car.plate}/invoices/${new Date(inspection.date).toISOString().split("T")[0]}-${inspection.location}-${inspection._id}`;
};

const _manageInvoice = async (inspectionAttr, oldAttr) => {
  const invoiceIsAPath = typeof inspectionAttr.invoice === "string";
  if (
    invoiceIsAPath &&
    inspectionAttr.invoice &&
    inspectionAttr.invoice.startsWith("temp-")
  ) {
    if (oldAttr.invoice) {
      await _removeInvoice(oldAttr.invoice);
    }

    const car = await CarRepository.findById(inspectionAttr.car);

    return persistFile(
      _getFilesPath({ _id: oldAttr._id, ...inspectionAttr }, car),
      inspectionAttr.invoice,
      "invoice"
    );
  } else if (!inspectionAttr.invoice && oldAttr.invoice) {
    return await _removeInvoice(oldAttr.invoice);
  }
};

const _removeInvoice = async (invoice) => {
  try {
    await deleteFile(invoice);
    return null; // Empty path
  } catch (e) {
    console.error("Error removing invoice: " + invoice);
  }
};

export default {
  findAll,
  findById,
  findParts,
  getInvoice,
  remove,
  save,
  update,
};
