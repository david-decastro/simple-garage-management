import HTTP from "./FetchRequest.js";

const RESOURCE_NAME = "files";

export default {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    return await HTTP.post(`${RESOURCE_NAME}/upload-pdf`, {
      body: formData,
    });
  },
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    return await HTTP.post(`${RESOURCE_NAME}/upload-image`, {
      body: formData,
    });
  },
};
