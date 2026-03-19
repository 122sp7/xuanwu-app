import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  // TODO: attach auth token
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: global error handling
    return Promise.reject(error);
  }
);
