import mongoose from "mongoose";
import { resultsPagination } from "../common/paginationUtils.js";
import Inspection from "../models/Inspection.js";

export async function findAll(filters, pagination = {}) {
  let query = Inspection.find(filters).populate({
    path: "car",
  });

  if (pagination.sort !== null) {
    query = query
      .collation({ locale: "en", strength: 2 })
      .sort(pagination.sort);
  }

  if (pagination.skip !== null && pagination.limit !== null) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const inspections = await query.exec();

  // Returns the result directly if there is no pagination
  if (pagination.skip == null && pagination.limit == null) {
    return inspections;
  }

  // Returns the results and the pagination info
  const totalDocuments = await Inspection.countDocuments(filters);
  return {
    data: inspections,
    pagination: resultsPagination(pagination, totalDocuments),
  };
}

export async function findById(inspectionId) {
  if (!mongoose.Types.ObjectId.isValid(inspectionId)) {
    return null;
  }
  return Inspection.findOne({ _id: inspectionId });
}

export async function findByCarId(carId) {
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    return null;
  }

  return await Inspection.find({ car: carId }).exec();
}

export async function findLastInspection(filters) {
  if (filters.car && !mongoose.Types.ObjectId.isValid(filters.car)) {
    return null;
  }

  return await Inspection.findOne(filters).sort({ date: -1 }).exec();
}

export async function create(inspection) {
  return await Inspection.create(inspection);
}

export async function update(inspectionId, modInspection) {
  return Inspection.findOneAndUpdate({ _id: inspectionId }, modInspection, {
    new: true,
    runValidators: true,
  });
}

export async function remove(inspectionId) {
  return Inspection.deleteOne({ _id: inspectionId });
}

export default {
  create,
  findAll,
  findById,
  findByCarId,
  findLastInspection,
  remove,
  update,
};
