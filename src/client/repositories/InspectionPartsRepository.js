import HTTP from "./FetchRequest.js";

const RESOURCE_NAME = "inspection-parts";

export default {
  async getAll(filters, pagination) {
    return await HTTP.get(`${RESOURCE_NAME}`, null, {
      ...filters,
      ...pagination,
    });
  },
  async save(newInspectionPart) {
    if (newInspectionPart._id) {
      return await HTTP.put(`${RESOURCE_NAME}/${newInspectionPart._id}`, {
        body: newInspectionPart,
      });
    } else {
      return await HTTP.post(`${RESOURCE_NAME}`, { body: newInspectionPart });
    }
  },
  async delete(id) {
    return await HTTP.delete(`${RESOURCE_NAME}/${id}`);
  },
};
