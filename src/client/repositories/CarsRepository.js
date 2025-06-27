import HTTP from "./FetchRequest.js";

const RESOURCE_NAME = "cars";

export default {
  async getAll(filters, pagination) {
    return await HTTP.get(`${RESOURCE_NAME}`, null, {
      ...filters,
      ...pagination,
    });
  },
  async getAllBasic(filters, pagination) {
    return await HTTP.get(`${RESOURCE_NAME}/basic`, null, {
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
  async save(newCar) {
    if (newCar._id) {
      return await HTTP.put(`${RESOURCE_NAME}/${newCar._id}`, {
        body: newCar,
      });
    } else {
      return await HTTP.post(`${RESOURCE_NAME}`, { body: newCar });
    }
  },
  async delete(id) {
    return await HTTP.delete(`${RESOURCE_NAME}/${id}`);
  },
};
