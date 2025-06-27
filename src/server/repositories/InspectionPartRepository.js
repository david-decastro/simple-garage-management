import { resultsPagination } from "../common/paginationUtils.js";
import InspectionPart from "../models/InspectionPart.js";

export async function findAll(filters, pagination = {}) {
  const { carId, ...otherFilters } = filters;

  let query = InspectionPart.find(otherFilters)
    .populate({
      path: "part",
    })
    .populate({
      path: "inspection",
      match: carId ? { car: carId } : {},
      populate: {
        path: "car",
      },
    });

  if (pagination.sort !== null) {
    query = query
      .collation({ locale: "en", strength: 2 })
      .sort(pagination.sort);
  }

  if (pagination.skip !== null && pagination.limit !== null) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const inspectionParts = await query.exec();

  // Returns the result directly if there is no pagination
  if (pagination.skip == null && pagination.limit == null) {
    return inspectionParts;
  }

  // Returns the results and the pagination info
  const totalDocuments = await InspectionPart.countDocuments(filters);
  return {
    data: inspectionParts,
    pagination: resultsPagination(pagination, totalDocuments),
  };
}

export async function findByInspectionIdAndPartId(inspection, part) {
  return InspectionPart.findOne({
    inspection,
    part,
  });
}

export async function create(inspectionPart) {
  return await InspectionPart.create(inspectionPart);
}

export async function update(inspectionPartId, modInspectionPart) {
  return InspectionPart.findOneAndUpdate(
    { _id: inspectionPartId },
    modInspectionPart,
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function remove(inspectionId) {
  return InspectionPart.deleteOne({ _id: inspectionId });
}

export async function removeByInspectionId(inspectionId) {
  return InspectionPart.deleteMany({ inspection: inspectionId });
}

export async function removeByPartId(partId) {
  return InspectionPart.deleteMany({ part: partId });
}

export default {
  findAll,
  findByInspectionIdAndPartId,
  create,
  update,
  remove,
  removeByInspectionId,
  removeByPartId,
};
