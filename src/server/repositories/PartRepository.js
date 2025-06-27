import mongoose from "mongoose";
import { resultsPagination } from "../common/paginationUtils.js";
import Part from "../models/Part.js";

export async function findAll(filters, pagination = {}) {
  const queryFilters = _manageFilters(filters);

  let query = Part.find(queryFilters);

  if (pagination.sort !== null) {
    query = query
      .collation({ locale: "en", strength: 2 })
      .sort(pagination.sort);
  }

  if (pagination.skip !== null && pagination.limit !== null) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const parts = await query.exec();

  // Returns the result directly if there is no pagination
  if (pagination.skip == null && pagination.limit == null) {
    return parts;
  }

  // Returns the results and the pagination info
  const totalDocuments = await Part.countDocuments(queryFilters);
  return {
    data: parts,
    pagination: resultsPagination(pagination, totalDocuments),
  };
}

export async function findById(partId) {
  if (!mongoose.Types.ObjectId.isValid(partId)) {
    return null;
  }
  return Part.findOne({ _id: partId });
}

export async function create(part) {
  return await Part.create(part);
}

export async function update(partId, modPart) {
  return Part.findOneAndUpdate({ _id: partId }, modPart, {
    new: true,
    runValidators: true,
  });
}

export async function remove(partId) {
  return Part.deleteOne({ _id: partId });
}

const _manageFilters = (filters) => {
  const queryFilters = [];
  const exactFilters = {};

  if (filters.name) {
    queryFilters.push({
      name: { $regex: filters.name, $options: "i" },
    });
  }

  if (filters.barcode) {
    queryFilters.push({
      barcode: { $regex: filters.barcode, $options: "i" },
    });
  }

  if (filters.type) {
    exactFilters.type = filters.type;
  }

  if (filters.oilViscosity) {
    exactFilters.oilViscosity = filters.oilViscosity;
  }

  return queryFilters.length > 0
    ? { ...exactFilters, $or: queryFilters }
    : { ...exactFilters };
};

export default { create, findAll, findById, remove, update };
