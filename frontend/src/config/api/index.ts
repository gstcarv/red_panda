import axios from "axios";
import { env } from "@/config/env";

// TODO: Replace with token from auth storage (localStorage/sessionStorage) when implementing login
const MOCK_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJydXRoLndyaWdodDEyQHN0dWRlbnQubWFwbGV3b29kLmVkdSIsImVtYWlsIjoicnV0aC53cmlnaHQxMkBzdHVkZW50Lm1hcGxld29vZC5lZHUiLCJ1c2VySWQiOjM1MCwiaWF0IjoxNzcxNjMyNDQ3LCJleHAiOjE3NzI0OTY0NDd9.qKVDvgho39zQZ_4xZ8EwFSX5xINEiA5Q3Xlit1FeF4xC7RJavZM5l4errtrKZSzf";

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${MOCK_TOKEN}`;
  return config;
});