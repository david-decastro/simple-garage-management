import HTTP from "./FetchRequest.js";

const RESOURCE_NAME = "inspections";

export default {
  async getAll(filters, pagination) {
    return await HTTP.get(`${RESOURCE_NAME}`, null, {
      ...filters,
      ...pagination,
    });
  },
  async get(id) {
    return await HTTP.get(`${RESOURCE_NAME}/${id}`);
  },
  async getParts(id, pagination) {
    return await HTTP.get(`${RESOURCE_NAME}/${id}/parts`, null, {
      ...pagination,
    });
  },
  async getInvoice(id) {
    const data = await HTTP.get(`${RESOURCE_NAME}/${id}/invoice`);
    if (data) {
      return URL.createObjectURL(data);
    }
  },
  async save(newInspection) {
    if (newInspection._id) {
      return await HTTP.put(`${RESOURCE_NAME}/${newInspection._id}`, {
        body: newInspection,
      });
    } else {
      return await HTTP.post(`${RESOURCE_NAME}`, { body: newInspection });
    }
  },
  async delete(id) {
    return await HTTP.delete(`${RESOURCE_NAME}/${id}`);
  },
};
