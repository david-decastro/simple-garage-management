import { sendNotification } from "../plugins/notifications.jsx";
import i18n from "../plugins/i18n.js";

const URL = import.meta.env.VITE_BASE_URL;

// TODO: hacer custom hooks

function manageResponse(response) {
  if (!response.ok) {
    const error = new Error(`Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type");

  if (
    contentType &&
    (contentType.startsWith("image/") || contentType === "application/pdf")
  ) {
    return response.blob();
  }

  if (response.status === 204) {
    return {};
  }

  return response.text().then((text) => {
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  });
}

export default {
  get(url, params, query) {
    const queryParams = new URLSearchParams(query);
    return fetch(`${URL}${url}?${queryParams}`, {
      ...params,
      method: "GET",
    }).then(manageResponse);
  },

  post(url, params) {
    const headers = {
      "Content-Type": "application/json",
      ...params.headers,
    };

    const body =
      params.body instanceof FormData
        ? params.body
        : JSON.stringify(params.body);

    if (params.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    return fetch(`${URL}${url}`, {
      ...params,
      headers: headers,
      method: "POST",
      body: body,
    }).then(manageResponse);
  },

  put(url, params) {
    const headers = {
      "Content-Type": "application/json",
      ...params.headers,
    };

    return fetch(`${URL}${url}`, {
      ...params,
      headers: headers,
      method: "PUT",
      body: JSON.stringify(params.body),
    }).then(manageResponse);
  },

  delete(url, params) {
    return fetch(`${URL}${url}`, { ...params, method: "DELETE" });
  },
};

const _sendNotification = (response) => {
  sendNotification({
    title: i18n.t(`common.notifications.${response.status}.title`),
    message: i18n.t(`common.notifications.${response.status}.message`),
    type: "error",
  });
};
