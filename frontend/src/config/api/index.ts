import axios from "axios";
import { env } from "@/config/env";

// TODO: Replace with token from auth storage (localStorage/sessionStorage) when implementing login
const MOCK_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJlbGl6YWJldGguZmxvcmVzMTJAc3R1ZGVudC5tYXBsZXdvb2QuZWR1IiwiZW1haWwiOiJlbGl6YWJldGguZmxvcmVzMTJAc3R1ZGVudC5tYXBsZXdvb2QuZWR1IiwidXNlcklkIjozNDAsImlhdCI6MTc3MTQ2NDU1OSwiZXhwIjoxNzcyMzI4NTU5fQ.-YwFoU6aaSsAEkVIEgEb7fJMm7RQY5UlWdfwtE-DXGqydrq_tVQ-jI4xpHn4eJpM";

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${MOCK_TOKEN}`;
  return config;
});