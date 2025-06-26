import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://haychatai.netlify.app/api" : "/api",
  withCredentials: true,
});
