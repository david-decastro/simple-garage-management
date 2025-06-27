import Part from "../models/Part.js";
import PartType from "../enums/PartType.js";
import { PartDTO } from "./dtos/PartDTO.js";

import { handleDbError } from "./errors/handleDbError.js";
import { ValidationError } from "./errors/ValidationError.js";
import { NotFoundError } from "./errors/NotFoundError.js";

import PartRepository from "../repositories/PartRepository.js";
import InspectionPartRepository from "../repositories/InspectionPartRepository.js";
import {
  deleteFile,
  deleteFolder,
  getFileAbsolutePath,
  getPartsFolder,
  persistFile,
} from "./FileService.js";

const findAll = async function (filters, pagination) {
  const parts = await PartRepository.findAll(filters, pagination);
  if (parts.data) {
    return {
      data: PartDTO.fromList(parts.data),
      pagination: parts.pagination,
    };
  } else {
    return PartDTO.fromList(parts);
  }
};

const find = async function (partId) {
  const part = await PartRepository.findById(partId);
  if (!part) {
    throw new NotFoundError(`Part with id '${partId}' not found`);
  }
  return new PartDTO(part);
};

const getImage = async function (partId) {
  const part = await PartRepository.findById(partId);
  if (!part) {
    throw new NotFoundError(`Part with id '${partId}' not found`);
  }

  if (!part.image) {
    throw new NotFoundError(`Image not found for part with id '${partId}'`);
  }

  return await getFileAbsolutePath(part.image);
};

const save = async function (partAttr) {
  _checkRequiredAttr(partAttr); // Throw an exception if one field is not completed
  const part = new Part(partAttr);
  if (part.type === PartType.OTHER) {
    part.oilViscosity = null;
  }
  const savedPart = await PartRepository.create(part);
  try {
    const imageName = await _manageImg(partAttr, savedPart);
    if (imageName) {
      savedPart.image = imageName;
      await savedPart.save();
    }
    return new PartDTO(savedPart);
  } catch (error) {
    // Rollback
    if (savedPart && savedPart._id) {
      await Part.deleteOne({ _id: savedPart._id });
    }
    handleDbError(error);
  }
};

const update = async function (partId, partAttr) {
  const part = await PartRepository.findById(partId);
  if (!part) {
    throw new NotFoundError(`Part with id '${partId}' not found`);
  }
  try {
    // Preparing attributes to update
    delete partAttr._id;
    if (part.type === PartType.OTHER) {
      part.oilViscosity = null;
    }
    const imageName = await _manageImg(partAttr, part);
    if (imageName) {
      partAttr.image = imageName;
    }
    return await PartRepository.update(partId, partAttr);
  } catch (error) {
    handleDbError(error);
  }
};

const remove = async function (partId) {
  // Deleting part
  const result = await PartRepository.remove(partId);
  if (result.deletedCount === 0) {
    throw new NotFoundError(`Part with id '${partId}' not found`);
  }

  await deleteFolder(`${getPartsFolder()}/${partId}/`);

  // Deleting associated InspectionPart
  await InspectionPartRepository.removeByPartId(partId);
};

const _checkRequiredAttr = (partAttr) => {
  if (!partAttr.name) {
    throw new ValidationError("The 'brand' field is required");
  }
  if (!partAttr.type || !Object.values(PartType).includes(partAttr.type)) {
    throw new ValidationError("The 'type' field is required");
  }
  if (partAttr.type !== PartType.OIL && !partAttr.barcode) {
    throw new ValidationError("The 'barcode' field is required");
  }
};

const _manageImg = async (partAttr, oldAttr) => {
  if (partAttr.image && partAttr.image.startsWith("temp-")) {
    try {
      if (oldAttr.image) {
        await deleteFile(oldAttr.image);
      }
    } catch (e) {
      console.error("Error removing old image: " + oldAttr.image);
    }

    return persistFile(
      `${getPartsFolder()}/${oldAttr._id}/`,
      partAttr.image,
      "main"
    );
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
