import HTTP from "./FetchRequest.js";

const RESOURCE_NAME = "parts";

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
  async getImage(id) {
    const data = await HTTP.get(`${RESOURCE_NAME}/${id}/image`);
    if (data) {
      return URL.createObjectURL(data);
    }
  },
  async save(newPart) {
    if (newPart._id) {
      return await HTTP.put(`${RESOURCE_NAME}/${newPart._id}`, {
        body: newPart,
      });
    } else {
      return await HTTP.post(`${RESOURCE_NAME}`, { body: newPart });
    }
  },
  async delete(id) {
    return await HTTP.delete(`${RESOURCE_NAME}/${id}`);
  },
  async deletePart(id) {
    return await HTTP.delete(`${RESOURCE_NAME}/parts/${id}`);
  },
};
