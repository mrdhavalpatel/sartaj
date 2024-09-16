import axios from "axios";
// http://192.168.29.41:8000/sartajfoods/api/v1/"
export const API_BASE_URL = "https://admin.sartajfoods.jp/api/v1/";
// export const API_BASE_URL = "http://192.168.29.41:8000/sartajfoods/api/v1/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
