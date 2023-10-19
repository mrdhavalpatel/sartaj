import axios from "axios";

const API_BASE_URL = "http://192.168.1.30:8000/api/v1/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
