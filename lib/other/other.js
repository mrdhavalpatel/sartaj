import { api, headers } from "../api";

export const ApiCall = async (
  method,
  endpoint,
  payload,
  isMultipart = false,
  token
) => {
  try {
    let response;
    const requestHeaders = { ...headers };
    if (token) {
      // If a token is provided, add it to the headers as a bearer token
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    if (isMultipart) {
      // If it's a multipart request, you can add specific headers here
      requestHeaders["Content-Type"] = "multipart/form-data";
    }

    switch (method) {
      case "get":
        response = await api.get(endpoint, { headers: requestHeaders });
        break;
      case "post":
        if (isMultipart) {
          const formData = new FormData();
          response = await api.post(endpoint, formData, {
            headers: requestHeaders,
          });
        } else {
          response = await api.post(endpoint, payload, {
            headers: requestHeaders,
          });
        }
        break;
      case "delete":
        response = await api.delete(endpoint, { headers: requestHeaders });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return response;
  } catch (error) {
    return error;
  }
};
