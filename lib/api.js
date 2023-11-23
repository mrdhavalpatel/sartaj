import axios from "axios";

export const API_BASE_URL =
  "https://phplaravel-941212-4027573.cloudwaysapps.com/api/v1/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
