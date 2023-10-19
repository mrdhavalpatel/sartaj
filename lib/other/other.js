import { api, headers } from "../api";

export const ApiCall = async (
  method,
  endpoint,
  payload,
  isMultipart = false
) => {
  try {
    let response;
    const requestHeaders = { ...headers };

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
          // For multipart POST requests, you might need to create a FormData object
          const formData = new FormData();
          // Add your multipart data to the formData object here
          // Example: formData.append('file', payload);
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
    console.log("response--->", response);
    return response;
  } catch (error) {
    return error;
  }
};
