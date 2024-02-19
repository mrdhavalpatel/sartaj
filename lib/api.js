import axios from "axios";

export const API_BASE_URL = "https://admin.sartajfoods.jp/api/v1/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
