import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://hay-chat-with-ai.vercel.app" : "/api",
  withCredentials: true,
});
