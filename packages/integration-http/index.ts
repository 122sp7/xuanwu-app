/**
 * @package integration-http
 * Axios HTTP client integration for external API calls.
 *
 * Provides a pre-configured Axios instance with:
 *   - Base URL from environment (NEXT_PUBLIC_API_BASE_URL)
 *   - 10 second timeout
 *   - JSON content type header
 *   - Request/response interceptors for auth token and error handling
 *
 * Usage:
 *   import { httpClient } from "@integration-http";
 *   const data = await httpClient.get("/api/resource");
 */

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
  },
);
